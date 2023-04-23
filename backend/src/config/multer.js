import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, res) => {
        res(null, "./assets");
    },
    filename: (req, file, res) => {
        res(null, Date.now() + "-" + file.originalname);
    }
});

export const upload = multer({ storage: storage });