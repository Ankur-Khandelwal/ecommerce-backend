const slugify = require('slugify');
const shortid = require('shortid');
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
      type: cate.type,
      parentId: cate.parentId,
      children: createCategories(categories, cate._id)
    });
  }
  return categoryList;
}

exports.addCategory =  (req, res, next)=>{
  const newCategory = {
    name: req.body.name,
    slug: `${slugify(req.body.name)}-${shortid.generate()}`
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

exports.updateCategories = async (req, res) => {
  const {_id, name, parentId, type} = req.body;
  // console.log(req);
  const updateCategories = [];
  if(name instanceof Array){
    for(let i=0; i<name.length; i++){
      const category = {
        name: name[i],
        type: type[i],
      };
      if(parentId[i] != ""){
        category.parentId = parentId[i];
      }
      const updatedCategory = await Category.findOneAndUpdate({_id: _id[i]}, category, {new: true});
      updateCategories.push(updatedCategory);
    }
    // console.log(updateCategories);
    return res.status(201).json({updateCategories});
  }else{
    const category = {
      name,
      type
    };
    if(parentId){
      category.parentId = parentId;
    }
    // console.log(category);
    const updatedCategory = await Category.findOneAndUpdate({_id}, category, {new: true});
    // console.log(updatedCategory);
    return res.status(201).json({updatedCategory});
  }
}

exports.deleteCategories =  async (req, res) => {
  const idsArray = req.body.payload;
  const deletedCategories = [];
  for(let i=0; i<idsArray.length; i++){
    const deletedCategory = await Category.findOneAndDelete({_id: idsArray[i]._id});
    deletedCategories.push(deletedCategory);
  }
  if(deletedCategories.length == idsArray.length){
    return res.status(201).json({message: 'Categories removed successfully.', deletedCategories});
  }else{
    return res.status(400).json({message: 'Something went wrong.'});
  }
}