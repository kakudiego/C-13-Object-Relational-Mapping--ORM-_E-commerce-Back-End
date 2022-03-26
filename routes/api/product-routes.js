const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  Product.findAll({
    include: [
      {
        model: Category,
      },
      {
        model: Tag,
      },
    ],
  })
    .then((dbProductData) => {
      // serialize the data
      const products = dbProductData.map((product) => product.get({ plain: true }));
      // return it to the user
      res.json(products);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get one product
router.get('/:id', (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  Product.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Category,
      },
      {
        model: Tag,
      },
    ],
  })
    .then((dbProductData) => {
      // serialize the data
      const product = dbProductData.get({ plain: true });
      // return it to the user
      res.json(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  // create new product
  // make sure to include its associated Tag data
  Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
  })
    .then((dbProductData) => {
      // add the new product's id to the list of tags
      const productId = dbProductData.id;
      const tagIds = req.body.tagIds;
      // create a new productTag for each tag in the list of tag ids
      // make sure to include the product id
      const newProductTags = tagIds.map((tagId) => {
        return {
          tagId,
          productId,
        };
      });
      // use the ProductTag model to create all the new productTags
      return ProductTag.bulkCreate(newProductTags);
    })
    .then(() => {
      // find all products
      // be sure to include its associated Category and Tag data
      return Product.findAll({
        include: [
          {
            model: Category,
          },
          {
            model: Tag,
          },
        ],
      });
    })
    .then((dbProductData) => {
      // serialize the data
      const products = dbProductData.map((product) => product.get({ plain: true }));
      // return it to the user
      res.json(products);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });

  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags.filter(({ tag_id }) => !req.body.tagIds.includes(tag_id)).map(({ id }) => id);

      // run both actions
      return Promise.all([ProductTag.destroy({ where: { id: productTagsToRemove } }), ProductTag.bulkCreate(newProductTags)]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      res.json(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
