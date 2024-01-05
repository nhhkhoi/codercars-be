const mongoose = require("mongoose");
const Car = require("../models/Car");
const { sendResponse, AppError } = require("../helpers/utils.js");
const carController = {};

carController.createCar = async (req, res, next) => {
  try {
    const newCar = req.body;
    if (!newCar) throw new AppError(402, "Bad Request", "Create new car Error");

    const insertNewCar = await Car.create(newCar);

    sendResponse(
      res,
      200,
      true,
      { data: insertNewCar },
      null,
      "Create Car Successfully!"
    );
  } catch (err) {
    next(err);
  }
};

carController.getCars = async (req, res, next) => {
  try {
    const filter = {};
    const carsPerPage = 10;
    const pageNumber = req.query.page || 1;
    const carTotal = await Car.count(filter);
    const carTotalPages = Math.ceil(carTotal / carsPerPage);
    const getCars = await Car.find(filter)
      .sort({ _id: 1 })
      .skip(pageNumber > 0 ? (pageNumber - 1) * carsPerPage : 0)
      .limit(carsPerPage);

    const listCars = { cars: getCars, total: carTotalPages };

    sendResponse(res, 200, true, listCars, null, "Get Car List Successfully!");
  } catch (err) {
    next(err);
  }
};

carController.editCar = async (req, res, next) => {
  try {
    const targetId = req.params.id;
    console.log("id", targetId);

    const updateInfo = req.body;
    console.log("updateinfo", updateInfo);
    const options = { new: true };
    const updateCar = await Car.findByIdAndUpdate(
      targetId,
      updateInfo,
      options
    );
    sendResponse(
      res,
      200,
      true,
      { data: updateCar },
      null,
      "Update Car Successfully"
    );
  } catch (err) {
    next(err);
  }
};

carController.deleteCar = async (req, res, next) => {
  try {
    const targetId = req.params.id;
    const options = { new: true };

    const deleteCar = await Car.findByIdAndDelete(targetId, options);
    sendResponse(
      res,
      200,
      true,
      { data: deleteCar },
      null,
      "Delete Car Successfully"
    );
  } catch (err) {
    next(err);
  }
};

module.exports = carController;
