import Supplie from "~/features/supplie/supplie.model";

const updateWarningSupplie = async (req, res, next) => {
    // eslint-disable-next-line no-unused-vars
    Supplie.update({ quantity: { $lte: 10 } }, { warning: "Sắp hết vật tư" }, (error, docs) => {
        if (error) {
            next(error);
        }
        else {
            next();
        }
    });

    Supplie.update({ quantity: { $gt: 10 } }, { warning: null }, (error) => {
      if (error) {
          next(error);
      }
      else {
          next();
      }
  });
};

export default updateWarningSupplie;