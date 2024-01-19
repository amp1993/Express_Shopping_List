const express = require("express")
const router = new express.Router()
const ExpressError =  require('./expressError')
const shoppingList = require("./fakeDB")

// Render a list of shopping items.

// **[{“name”: “popsicle”, “price”: 1.45}, {“name”:”cheerios”, “price”: 3.40}]**

router.get('/items', function(req,res){
    res.json({shoppingList})
})


// Add new item to shopping list
// **{“name”:”popsicle”, “price”: 1.45} => {“added”: {“name”: “popsicle”, “price”: 1.45}}**


router.post('/items', function(req, res){
    const newItem = {name: req.body.name, price : req.body.price}
    shoppingList.push(newItem)
    res.status(201).json({name: newItem.name, price: newItem.price})

})


// Display a single item’s name and price.

// **{“name”: “popsicle”, “price”: 1.45}**


router.get('/items/:name', function(req, res){
    const findItem = shoppingList.find(shoppingList => shoppingList.name === req.params.name)
    if(findItem === undefined){
        throw new ExpressError('Item Not Found', 404)
    }
    res.json({shoppingList: findItem})
})


// Modify a single item’s name and/or price.
// **{“name”:”new popsicle”, “price”: 2.45} => {“updated”: {“name”: “new popsicle”, “price”: 2.45}}**

router.patch('/items/:name', function(req, res){
    const findItem = shoppingList.find(shoppingList => shoppingList.name === req.params.name)
    if(findItem === undefined){
        throw new ExpressError('Item Not Found', 404)
    }
    findItem.name = req.body.name
    findItem.price = req.body.price
    res.json({shoppingList: findItem})
})

// Delete a specific item from the array.
// **{message: “Deleted”}**

router.delete('/items/:name', function(req,res){
    const findItem = shoppingList.find(shoppingList => shoppingList.name === req.params.name)
    if(findItem === -1){
        throw new ExpressError('Item Not Found', 404)
    }
    shoppingList.splice(findItem, 1)
    res.json({message: 'Deleted'})
})


module.exports = router;
