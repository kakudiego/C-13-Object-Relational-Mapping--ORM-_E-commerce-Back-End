// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id',
});

// Category hasMany Products
Category.hasMany(Product, {
  foreignKey: 'category_id',
});

// Product hasMany Tags
Product.hasMany(Tag, {
  foreignKey: 'product_id',
});

// Tag hasMany Products
Tag.hasMany(Product, {
  foreignKey: 'tag_id',
});

// ProductTag belongsTo Product
ProductTag.belongsTo(Product, {
  foreignKey: 'product_id',
});

// Product belongsToMany Tags
Product.belongsToMany(Tag, {
  through: ProductTag,
  foreignKey: 'product_id',
});

// Tag belongsToMany Products
Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: 'tag_id',
});

// export
module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
