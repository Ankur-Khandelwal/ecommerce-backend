const slugify = require('slugify');
const Category = require('../models/category');
const env = require('dotenv');
env.config();

function createCategories(categories, parentId = null){
  const categoryList = [];
  let category;
  if(parentId==null){
    category = categories.filter(cat => cat.parentId == undefined);
  }else{
    category = categories.filter(cat=>cat.parentId == parentId);
  }

  for(let cate of category){
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      children: createCategories(categories, cate._id)
    });
  }
  return categoryList;
}

exports.addCategory =  (req, res, next)=>{
  const newCategory = {
    name: req.body.name,
    slug: slugify(req.body.name)
  }
  if(req.file){
    newCategory.categoryImage = process.env.API + '/public/' + req.file.filename;
  }
  if(req.body.parentId){
    newCategory.parentId = req.body.parentId;
  }
  const category = new Category(newCategory);
  category.save((error, cat)=>{
    if(error) return res.status(400).json({error: error});
    if(category){
      return res.status(201).json({category});
    }
  })
};

exports.getCategories = (req, res) => {
  Category.find({})
  .exec((error, categories)=>{
    if(error) return res.status(400).json({error: error});
    if(categories){
      const categoryList = createCategories(categories);
      res.status(200).json({categoryList});
    }
  })
};