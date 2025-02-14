const CategoryMessage = Object.freeze({
  Created: "category created successfully",
  NotFound: "category not found",
  AlreadyExist: "category already exist",
  Deleted: "category deleted successfully",
});

module.exports = {
  CategoryMessage
}


// {
//   "_id": "65dcbf6e7a1c230b12345678",
//   "name": "موبایل",
//   "slug": "mobile",
//   "icon": "mobile-icon.png",
//   "parent": null,
//   "parents": [],
//   "children": [
//   {
//     "_id": "65dcbf6e7a1c230b98765432",
//     "name": "گوشی سامسونگ",
//     "slug": "samsung",
//     "icon": "samsung-icon.png",
//     "parent": "65dcbf6e7a1c230b12345678",
//     "parents": ["65dcbf6e7a1c230b12345678"]
//   }
// ]
// }
