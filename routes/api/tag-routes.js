const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  Tag.findAll({
    include: {
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock'],
      as: 'products',
    },
  })
    .then((dbTagData) => res.json(dbTagData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock'],
        as: 'products',
      },
    ],
  })
    .then((dbTagData) => {
      // serialize the data
      const tag = dbTagData.get({ plain: true });
      // return it to the user
      res.json(tag);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create(req.body)
    .then((dbTagData) => {
      res.json(dbTagData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  console.log(`\n ++++++++++ new tag added: ${req.body.tag_name} ++++++++++ \n`);
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((dbTagData) => {
      res.json(dbTagData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  console.log(`\n ^^^^^^^^^^ tag_name updated: ${req.body.tag_name} ^^^^^^^^^^ \n`);
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbTagData) => res.json(dbTagData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  console.log(`\n ---------- tag_id deleted: ${req.params.id} ---------- \n`);
});

module.exports = router;
