process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
let shoppingList = require("./fakeDB");

let newItem = { name: "popsicle", price: 1.45 };

beforeEach(function() {
  shoppingList.push(newItem);
});

afterEach(function() {
  // make sure this *mutates*, not redefines, `cats`
  shoppingList.length = 0;
});
// end afterEach

// **[{“name”: “popsicle”, “price”: 1.45}, {“name”:”cheerios”, “price”: 3.40}]**

describe("GET /items", function() {
  test("Gets a list of groceries", async function() {
    const resp = await request(app).get(`/items`);
    expect(resp.statusCode).toBe(200);

    expect(resp.body).toEqual({shoppingList: [newItem]});
  });
});

// **{“name”:”popsicle”, “price”: 1.45} => {“added”: {“name”: “popsicle”, “price”: 1.45}}**

describe("POST /items", function() {
    test("Creates a new item", async function() {
      const resp = await request(app)
        .post(`/items`)
        .send({
          name: "Apples",
          price: 3.00
        });
      expect(resp.statusCode).toBe(201);
      expect(resp.body).toEqual({ name: "Apples",
    price:3.00 
      });
    });
  });
  // end

// **{“name”: “popsicle”, “price”: 1.45}**

describe("GET /items/:name", function() {
  test("Gets a single item", async function() {
    const resp = await request(app).get(`/items/${newItem.name}`);
    expect(resp.statusCode).toBe(200);

    expect(resp.body).toEqual({shoppingList: {name: 'popsicle', price: 1.45}})});

  test("Responds with 404 if can't find item", async function() {
    const resp = await request(app).get(`/items/0`);
    expect(resp.statusCode).toBe(404);
  });
});
// end


// **{“name”:”new popsicle”, “price”: 2.45} => {“updated”: {“name”: “new popsicle”, “price”: 2.45}}**

describe("PATCH /items/:name", function() {
  test("Updates a single item", async function() {
    const resp = await request(app)
      .patch(`/items/${newItem.name}`)
      .send({
        name: "new popsicle",
        price: 2.45
      });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({shoppingList: {name: "new popsicle", price: 2.45}});
  });

  test("Responds with 404 if id invalid", async function() {
    const resp = await request(app).patch(`/items/0`);
    expect(resp.statusCode).toBe(404);
  });
});
// end

/** DELETE ,
 *  return `{message: "Cat deleted"}` */

describe("DELETE /items/:name", function() {
  test("Deletes a single item", async function() {
    const resp = await request(app).delete(`/items/${newItem.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "Deleted" });
  });
});
// end
