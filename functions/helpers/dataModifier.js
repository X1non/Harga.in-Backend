const admin = require("firebase-admin");

const appendBrandCategory = async (productData) => {
  const brandId = productData.brandId;
  const categoryId = productData.categoryId;

  let categorySnapshot = await admin.firestore().collection("categories").doc(categoryId).get();
  let categoryData = categorySnapshot.data();
  productData.category = {
    id: categoryId,
    name: categoryData.name,
  };

  let brandSnapshot = await admin.firestore().collection("brands").doc(brandId).get();
  let brandData = brandSnapshot.data();
  productData.brand = {
    id: brandId,
    name: brandData.name,
  };

  delete productData.categoryId;
  delete productData.brandId;

  return productData;
};

const setBrandCategory = (brandsMap, categoriesMap, productData) => {
  productData.brand = {
    id: productData.brandId,
    name: brandsMap.get(productData.brandId),
  };
  console.log("masuk set: ", productData.brand);

  delete productData.brandId;

  productData.category = {
    id: productData.categoryId,
    name: categoriesMap.get(productData.categoryId),
  };

  delete productData.categoryId;

  return productData;
};

module.exports = {
  appendBrandCategory: appendBrandCategory,
  setBrandCategory: setBrandCategory,
};
