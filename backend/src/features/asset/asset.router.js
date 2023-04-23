
import express from "express";

import { upload } from "~/config/multer";
import { createAssetMiddleware } from "~/middleware/asset/create-asset.middleware";
import { deleteAssetMiddleware } from "~/middleware/asset/delete-asset.middleware";
import { readAssetMiddleware } from "~/middleware/asset/read-asset.middleware";

import AssetController from "./asset.controller";

const assetRouter = express.Router();
assetRouter.post("/create", createAssetMiddleware, upload.array("files", 12), AssetController.createAssets);
assetRouter.delete("/delete/:id", deleteAssetMiddleware, AssetController.deleteAsset);
assetRouter.get("/single/:id", readAssetMiddleware, AssetController.getAsset);
assetRouter.get("/list", readAssetMiddleware, AssetController.getAssets);

export default assetRouter;