const rdfParser = require('rdf-parse').default;
const fs = require('fs');
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './data/app.db',
  },
  useNullAsDefault: true,
});

const filename = process.argv.length > 2 ? process.argv[2] : '';
const kbUID = process.argv.length > 3 ? process.argv[3] : filename;

// console.log(filename);

const upsert = async (params) => {
  const { table, data, constraint } = params;
  const insert = knex(table).insert(data);
  const update = knex.queryBuilder().update(data);
  return await knex
    .raw(`? ON CONFLICT ${constraint} DO ?`, [insert, update])
    .catch((err) => {
      console.error(err);
    });
};

function extractLabel(quad) {
  const LABEL_PREDICATES = [
    'http://www.w3.org/2004/02/skos/core#prefLabel',
    'http://www.w3.org/2000/01/rdf-schema#label',
  ];
  const res = LABEL_PREDICATES.filter((p) => quad.predicate.value === p && !!quad.object.value).map(
    () => ({
      iri: quad.subject.value,
      literal: quad.object.value,
      lang: quad.object.language,
    }),
  );
  return res;
}

function extractDescription(quad) {
  const DESCRIPTION_PREDICATES = [
    'http://www.w3.org/2000/01/rdf-schema#comment',
  ];
  const res = DESCRIPTION_PREDICATES.filter(
    (p) => quad.predicate.value === p && !!quad.object.value,
  ).map(() => ({
    iri: quad.subject.value,
    literal: quad.object.value,
    lang: quad.object.language,
  }));
  return res;
}

async function main() {
  await knex.raw('PRAGMA journal_mode = wal;');

  const quadStream = rdfParser.parse(fs.createReadStream(filename), {
    path: filename,
  });

  for await (const quad of quadStream) {
    // console.log(quad);

    if (quad.subject.termType !== 'NamedNode') {
      continue;
    }

    const labels = extractLabel(quad);

    if (labels.length > 0) {
      await Promise.all(
        labels.map(async (label) => {
          console.log({
            iri: label.iri,
          });

          await upsert({
            table: 'identifiable',
            data: {
              iri: label.iri,
            },
            constraint: '(iri)',
          });

          await upsert({
            table: 'identifiable_label',
            data: {
              identifiable_iri: label.iri,
              literal: label.literal,
              lang: label.lang,
              kb_uid: kbUID,
            },
            constraint: '(identifiable_iri, literal, lang, kb_uid)',
          });
        }),
      );
    }

    const descriptions = extractDescription(quad);

    if (descriptions.length > 0) {
      await Promise.all(
        descriptions.map(async (description) => {
          console.log({
            iri: description.iri,
          });

          upsert({
            table: 'identifiable',
            data: {
              iri: description.iri,
            },
            constraint: '(iri)',
          });

          upsert({
            table: 'identifiable_description',
            data: {
              identifiable_iri: description.iri,
              literal: description.literal,
              lang: description.lang,
              kb_uid: kbUID,
            },
            constraint: '(identifiable_iri, literal, lang, kb_uid)',
          });
        }),
      );
    }
  }
  knex.destroy();
}

main();
