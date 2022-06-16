const admin = require("firebase-admin");

const express = require("express");
const cookieParser = require("cookie-parser")();
const cors = require("cors")({
	origin: true,
	methods: "GET,POST,PUT,DELETE",
	allowedHeaders: "Authorization",
});
const authMiddleware = require("../authMiddleware");
const app = express();

const isObjectEmpty = (obj) => {
	return obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype;
};

// Applying CORS, Cookie Parser, and Middleware that validates Firebase ID Token
app.use(cors);
app.use(cookieParser);
app.use(authMiddleware);

// Create Brand
app.post("/", async (req, res) => {
	const data = req.body;
	const requiredData = ["name"];
	let missingData;
	let emptyData = [];

	requiredData.forEach((attr) => {
		if (!(attr in data)) {
			missingData = attr;
			return;
		} else {
			// Check if req.body value empty
			if (data[attr] === "") {
				emptyData.push(attr);
			}
		}
	});

	if (missingData) {
		res.status(400).send({
			error: true,
			message: `Brand needs to have ${missingData} attribute`,
		});
		return;
	}

	if (emptyData.length > 0) {
		res.status(400).send({
			error: true,
			message: `This property: '${emptyData}' cannot be empty`,
		});
		return;
	}

	for (field in data) {
    // Check req.body if there's uneeded data fields
    if (!requiredData.includes(field)) {
      res.status(403).send({
        error: true,
        message: `You are not allowed to add '${field}' data to brand`,
      });
      return;
    }
  }

	data["createdAt"] = admin.firestore.FieldValue.serverTimestamp();
	data["updatedAt"] = "";

	try {
		const createdBrandRef = await admin.firestore().collection("brands").add(data);
		const createdBrand = await createdBrandRef.get();
		res.status(201).send({
			error: false,
			message: `Brand successfully created`,
			data: { id: createdBrand.id, ...createdBrand.data() },
		});
	} catch (error) {
		res.status(404).send({
			error: true,
			message: `Error creating brand`,
		});
	}
});

// Get all Brands
app.get("/", async (req, res) => {
	try {
		const brandsSnapshot = await admin.firestore().collection("brands").get();
		let brands = [];

		brandsSnapshot.forEach((doc) => {
			let brandId = doc.id;
			let brandData = doc.data();

			brands.push({ brandId, ...brandData });
		});

		res.status(200).send({
			error: false,
			message: "Brands fetched successfully",
			data: brands,
		});
	} catch (error) {
		res.status(404).send({
			error: true,
			message: `Error fetching brands`,
		});
	}
});

// Get specified Brand by ID
app.get("/:id", async (req, res) => {
	try {
		const brandSnapshot = await admin.firestore().collection("brands").doc(req.params.id).get();
		const brandId = brandSnapshot.id;
		const brandData = brandSnapshot.data();

		if (!brandData) {
			res.status(200).send({
				error: false,
				message: "Brand fetched successfully",
				brand: {},
			});
		} else {
			res.status(200).send({
				error: false,
				message: "Brand fetched successfully",
				data: { id: brandId, ...brandData },
			});
		}
	} catch (error) {
		res.status(404).send({
			error: true,
			message: `Error fetching brand`,
		});
	}
});

// Update Brand
app.put("/:id", async (req, res) => {
	const data = req.body;
	const updatableData = ["name"];
	let emptyData = [];

	if (isObjectEmpty(data)) {
		res.status(400).send({
			error: true,
			message: `There's no data provided`,
		});
		return;
	}

	// Validate data that's going to be updated
	for (field in data) {
		if (!updatableData.includes(field)) {
			res.status(403).send({
				error: true,
				message: `You are not allowed to add or change '${field}' data to brand`,
			});
			return;
		} else if (data[field] === "") {
			emptyData.push(attr);
		}
	}

	if (emptyData.length > 0) {
		res.status(400).send({
			error: true,
			message: `This property: '${emptyData}' cannot be empty`,
		});
		return;
	}

	try {
		const brandRef = admin.firestore().collection("brands").doc(req.params.id);
		const brandSnapshot = await brandRef.get();
		const brandData = brandSnapshot.data();

		if (!brandData) {
			res.status(404).send({
				error: true,
				message: `No brand data to be found`,
			});
			return;
		}

		data["updatedAt"] = admin.firestore.FieldValue.serverTimestamp();

		await brandRef.update(data);
		const brandUpdated = await brandRef.get();

		res.status(200).send({
			error: false,
			message: "Brand updated successfully",
			data: { id: brandUpdated.id, ...brandUpdated.data() },
		});
	} catch (error) {
		console.log(error);
		res.status(404).send({
			error: true,
			message: `Error updating brand`,
		});
	}
});

// Delete Brand
app.delete("/:id", async (req, res) => {
	try {
		const brandRef = admin.firestore().collection("brands").doc(req.params.id);
		const brandSnapshot = await brandRef.get();
		const brandData = brandSnapshot.data();

		if (!brandData) {
			res.status(404).send({
				error: true,
				message: `No brand data to be found`,
			});
			return;
		}

		const brandDeleted = await brandRef.get();
		await brandRef.delete();

		res.status(200).send({
			error: false,
			message: "Brand deleted successfully",
			data: { id: brandDeleted.id, ...brandDeleted.data() },
		});
	} catch (error) {
		res.status(404).send({
			error: true,
			message: `Error deleting brand`,
		});
	}
});

exports.app = app;
