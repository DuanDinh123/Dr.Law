// ** React Imports
import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

// ** Store & Actions
import { getTip, createTip, updateTip } from "../store";
import { getCategoryTipList } from "../../category-tip/store";
import { getSupplieList } from "../../supplie/store";
import { useDispatch, useSelector } from "react-redux";

// ** Reactstrap Imports
import {
  Button,
  Label,
  Form,
  Col,
  Input,
  Card,
  Table,
  CardHeader,
  CardBody,
  Breadcrumb,
  Spinner,
  BreadcrumbItem,
  FormGroup,
} from "reactstrap";

// ** Third Party
import { useForm, Controller, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";

// ** Third Party Components
import Select from "react-select";

// ** Utils
import { selectThemeColors } from "@utils";
import { currency } from "../../currencyPrice";

const defaultValues = {
  name_tip: null,
  category_tip: null,
  symptom: null,
  price: null,
  discount: null,
  position: null,
  note: null,
};

const TipCreate = () => {
  let categoryTipOption;

  // ** States
  const [isSubmited, setIsSubmited] = useState(false);
  const [switchActive, setSwitchActive] = useState(false);
  const [dataCategoryTip, setDataCategoryTip] = useState();
  // const [dataSupplie, setDataSupplie] = useState();

  // ** Store Vars
  const store = useSelector((state) => state.tip);
  const storeCategoryTip = useSelector((state) => state.categoryTip);
  const storeSupplie = useSelector((state) => state.supplie);

  const currentUser = JSON.parse(localStorage.getItem("userData")).name;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getTip(id));
    }
  }, [id]);

  const {
    control,
    setValue,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ defaultValues });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "supplies",
  });

  // ** Function to handle form submit
  const onSubmit = (data) => {
    if (!id) {
      const supplies = data.supplies.map((item) => {
        return { id: item.value.value, quantity: Number(item.quantity) }
      })
      supplies && dispatch(
        createTip({
          name_tip: data.name_tip,
          category_tip: data.category_tip.value,
          price: Number(data.price),
          symptom: data.symptom,
          discount: Number(data.discount),
          position: data.position,
          note: data.note,
          supplies: supplies
        })
      )
    } else {
      dispatch(
        updateTip({
          id,
          tip: {
            name_tip: data.name_tip,
            category_tip: data.category_tip.value,
            price: Number(data.price),
            symptom: data.symptom,
            discount: Number(data.discount),
            position: data.position,
            note: data.note,
            supplies: data.supplies,
          },
        })
      )
    }
    setIsSubmited(true)
  };

  useEffect(() => {
    if (!store.create.loading && isSubmited && !id && !store.create.error) {
      setIsSubmited(false)
      navigate('/apps/tip/list')
      toast.success('Tạo thủ thuật thành công thành công!')
    }

    if (!store.create.loading && isSubmited && !id && store.create.error) {
      setIsSubmited(false)
      if (store.create.data?.isValidate) {
        store.create.data?.errors.forEach(error => {
          setError(error.fieldError, { message: error.message })
        });
      } else {
        toast.error(store.create.data?.message)
      }
    }
    if (!store.update.loading && isSubmited && id && !store.update.error) {
      setIsSubmited(false)
      navigate('/apps/tip/list')
      toast.success('Cập nhật thủ thuật thành công!')
    }
    if (!store.update.loading && isSubmited && id && store.update.error) {
      setIsSubmited(false)
      if (store.update.data?.isValidate) {
        store.update.data?.errors.forEach(error => {
          setError(error.fieldError, { message: error.message })
        });
      } else {
        toast.error(store.update.data?.message)
      }
    }

  }, [
    id,
    isSubmited,
    store.create.loading,
    store.create.error,
    store.update.loading,
    store.update.error,
    setIsSubmited,
    navigate,
    setError
  ])

  // useEffect(() => {
  //   if (isSubmited) {
  //     setIsSubmited(false);
  //     navigate("/apps/tip/list");
  //   }
  // }, [isSubmited]);

  useEffect(() => {
    setValue("active", switchActive);
  }, [switchActive]);

  useEffect(() => {
    if (!store.single.loading && id && store.single.data && dataCategoryTip) {
      const {
        name_tip,
        category_tip,
        price,
        symptom,
        discount,
        position,
        note,
        supplies,
      } = store.single.data;
      const optionTip = dataCategoryTip?.filter((item) => item.value == category_tip._id)[0];
      setValue("name_tip", name_tip);
      setValue("price", price);
      setValue("symptom", symptom);
      setValue("discount", discount);
      setValue("position", position);
      setValue("category_tip", optionTip);
      setValue("supplies", supplies);
      setValue("note", note);
    }
  }, [id, store.single.loading, store.single.data, dataCategoryTip]);

  useEffect(() => {
    dispatch(getCategoryTipList({ page: 1, limit: 100 }));
    dispatch(getSupplieList({ page: 1, limit: 100 }));
  }, []);

  useEffect(() => {
    if (!storeCategoryTip?.list.loading && storeCategoryTip?.list.data) {
      const categoryTipOption = storeCategoryTip?.list?.data?.docs?.map(
        (item) => {
          return { value: item._id, label: item.name };
        }
      );

      setDataCategoryTip(categoryTipOption);
    }
  }, [storeCategoryTip]);

  // useEffect(() => {
  //   if (!storeSupplie?.list.loading && storeSupplie?.list.data) {
  //     const supplieOption = storeSupplie?.list?.data?.docs?.map((item) => {
  //       return { value: item._id, label: item.name };
  //     });

  //     setDataSupplie(supplieOption);
  //   }
  // }, [storeSupplie]);

  useEffect(() => {
    if (dataCategoryTip) {
      setValue("category_tip", {
        value: dataCategoryTip[0]?.value && dataCategoryTip[0]?.value,
        label: dataCategoryTip[0]?.label,
      });
    }
  }, [dataCategoryTip])

  return (
    <>
      {!store.single.loading || !store.list.loading ? (
        <Card>
          <CardHeader>
            <div className="col">
              <Breadcrumb className="mb-1">
                <BreadcrumbItem>
                  <Link to="/"> Trang chủ </Link>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <Link to="/apps/tip/list"> Thủ thuật </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                  <span> {id ? `Sửa` : `Tạo mới`}</span>
                </BreadcrumbItem>
              </Breadcrumb>
              {!id && <h5 className="mb-0">Tạo thủ thuật</h5>}
            </div>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="mb-1 col-9">
                  <Label className="form-label" for="name_tip">
                    Tên thủ thuật <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    name="name_tip"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Input
                        id="name_tip"
                        placeholder="Tên thủ thuật ..."
                        invalid={errors.name_tip && true}
                        {...register("name_tip")}
                        {...field}
                      />
                    )}
                  />
                </div>

                <div className="mb-1 col-3">
                  <Label className="form-label" for="category_tip">
                    Nhóm thủ thuật <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    name="category_tip"
                    rules={{ required: true }}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...register("category_tip")}
                        theme={selectThemeColors}
                        className="react-select"
                        classNamePrefix="select"
                        options={dataCategoryTip}
                        isClearable={false}
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="row">
                <div className="mb-1 col-3">
                  <Label className="form-label" for="position">
                    Vị trí
                  </Label>
                  <Controller
                    name="position"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="text"
                        id="position"
                        placeholder="eg: vị trí"
                        invalid={errors.position && true}
                        {...register("position")}
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className="mb-1 col-9">
                  <Label className="form-label" for="symptom">
                    Triệu chứng <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    name="symptom"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Input
                        type="textarea"
                        id="symptom"
                        placeholder="Triệu chứng"
                        invalid={errors.symptom && true}
                        {...register("symptom")}
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="row">
                <div className="mb-1 col-6">
                  <Label className="form-label" for="price">
                    Đơn giá
                  </Label>
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        id="price"
                        placeholder="10000"
                        {...register("price")}
                        invalid={errors.price && true}
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className="mb-1 col-6">
                  <Label className="form-label" for="discount">
                    Giảm giá
                  </Label>
                  <Controller
                    name="discount"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        id="discount"
                        placeholder="Giẩm giá"
                        {...register("discount")}
                        invalid={errors.discount && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="mb-1">
                <Label className="form-label" for="note">
                  Ghi chú
                </Label>
                <Controller
                  name="note"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="textarea"
                      id="note"
                      placeholder="1"
                      invalid={errors.note && true}
                      {...register("note")}
                      {...field}
                    />
                  )}
                />
              </div>
              {/* <div className="mb-1 col-12">
                <Label className="form-label" for="supplies">
                  Vật tư <span className="text-danger">*</span>
                </Label>
                {fields.map((item, index) => {

                  return (
                    <div key={item.id} className="row">
                      <div className="mb-1 col-6">
                        <Controller
                          name={`supplies.${index}.value`}
                          rules={{ required: true }}
                          control={control}
                          render={({ field }) => (
                            <Select
                              style={{ color: "black" }}
                              {...register(`supplies.${index}.value`)}
                              className="react-select"
                              classNamePrefix="select"
                              options={dataSupplie}
                              isClearable={false}
                              {...field}
                            />
                          )}
                        />
                      </div>
                      <div className="mb-1 col-2">
                        <Controller
                          name={`supplies.${index}.quantity`}
                          rules={{ required: true }}
                          control={control}
                          render={({ field }) => (
                            <Input
                              id="quantity"
                              placeholder="Số lượng"
                              invalid={errors.quantity && true}
                              {...field}
                            />
                          )}
                        />
                      </div>
                      <div className="mb-1 col-4">
                        <Button type="button" color="danger" onClick={() => remove(index)}>
                          Xóa
                        </Button>
                      </div>

                    </div>
                  );
                })}
                <Button
                  type="button"
                  color="primary"
                  onClick={() => {
                    append({ value: "iddd", quantity: 2 });
                  }}
                >
                  Thêm vật tư
                </Button>
              </div> */}

              <div className="mb-1 col-2">
                <Label className="form-label" for="modified_by">
                  Nguời cập nhật
                </Label>
                <Controller
                  name="modified_by"
                  control={control}
                  render={() => (
                    <Input
                      id="modified_by"
                      placeholder="bsphuong"
                      disabled
                      value={currentUser}
                    />
                  )}
                />
              </div>

              {store.create.loading ? (
                <Button color="secondary" className="me-1">
                  <Spinner color="light" size="sm" />
                  <span className="ms-50">Đang thêm...</span>
                </Button>
              ) : (
                <Button type="submit" className="me-1" color="primary">
                  Lưu
                </Button>
              )}
              <Button
                type="reset"
                color="secondary"
                outline
                onClick={() => navigate("/apps/tip/list")}
              >
                Hủy
              </Button>
            </Form>
          </CardBody>
        </Card>
      ) : (
        <div>Loadinng..</div>
      )}
    </>
  );
};

export default TipCreate;
