const express = require("express");
const bodyParser = require("body-parser");
const ProductService = require("./ProductService");
const validationFunction = require("./validation");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello Welcome to Product Hunt!");
});

app.get("/products", async (req, res) => {
  try {
    let products = await ProductService.getProduct();
    res.json(products);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await ProductService.getProduct(id);
    if (!product) {
      res.status(404).send("Product don't exists");
    }
    res.json(product);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.patch("/product/:id/upvotes", async (req, res) => {
  try {
    const prdid = req.params.id;
    const user = req.body;
    if (
      !(
        validationFunction.validateId(prdid) &&
        validationFunction.validateId(user._id.$oid)
      )
    )
      throw new Error(`id is not valid`);
    const response = await ProductService.addUpVote(user, prdid);
    response
      ? res.status(200).send("upvoted")
      : res.status(200).send("downvoted");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.patch("/product/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const pBody = req.body;
    const response = await ProductService.updateProduct(pBody, id);
    response
      ? res.status(200).send("upvoted")
      : res.status(200).send("downvoted");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.put("/product/:Id", async (req, res) => {
  const Id = req.params.productId;
  const updateData = req.body;

  const updatedProduct = await ProductService.updateProduct(Id, updateData);

  res.json(updatedProduct);
});

app.post("/product/:id/comment", async (req, res) => {
  try {
    const prdid = req.params.id;
    const commentBody = req.body;
    const result = await ProductService.addComment(commentBody, prdid);
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
});
app.post("/product/:id/tag", async (req, res) => {
  try {
    const prdid = req.params.id;
    const reqBody = req.body;
    const result = await ProductService.addTag(reqBody._id, prdid);
    res.send(result);
  } catch (err) {
    res.send(`${err.message}`);
  }
});

app.delete("/product/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // const userid = req.body.userid;

    const result = await ProductService.deleteProduct(id);
    if (result) res.status(200).send("deleted");
    else res.status(400).send("Product don't exist");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.listen(8000, () => {
  console.log(`Product app listening on port 8000`);
});
