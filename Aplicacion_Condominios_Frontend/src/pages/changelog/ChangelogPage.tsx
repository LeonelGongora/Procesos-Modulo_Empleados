import React, { useEffect, useState } from "react";
import "./style.css";
import { CategoryForm } from "./categoryService/registerCategory/CategoryForm";
import CategoryList from "./categoryService/categoryList/CategoryList";
import { getAllCategories } from "../../mantenimiento/services/maintenance/categoryService";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { deleteCategory } from "../../mantenimiento/services/maintenance/categoryService";

type Props = {};

const ChangelogPage = (props: Props) => {
  const [categories, setCategories] = useState<
    { id: number; catnombre: string; catdescripcion: string }[]
  >([]);

  const [flag, setFlag] = useState(true);

  const handleRegisterCategory = (
    id: number,
    catnombre: string,
    catdescripcion: string
  ) => {
    setCategories([...categories, { id, catnombre, catdescripcion }]);
  };

  const handleDelete = (id: number) => {
    deleteItem(id);
  };

  const deleteItem = async (id: number) => {
    try {
      console.log("Flag antes:", flag);
      deleteCategory(id);
      setFlag(!flag);
      console.log("Flag despues:", flag);
    } catch (error) {}
  };

  useEffect(() => {
    getCategories();
  }, [flag]);

  const getCategories = async () => {
    try {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
    } catch (error) {}
  };

  return (
    <>
      <h2>CATEGORÍAS DE SERVICIOS</h2>
      <div id="content">
        <CategoryForm onRegister={handleRegisterCategory} />
        <div className="row">
          <div className="col">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th className="left">Nombre de la categoría</th>
                  <th className="left">Descripción</th>
                  <th className="righ">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={index}>
                    <td>{category.catnombre}</td>
                    <td>{category.catdescripcion}</td>
                    <td className="actions">
                      <button type="button">
                        <CreateOutlinedIcon fontSize="large" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(category.id)}
                      >
                        <DeleteOutlinedIcon fontSize="large" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangelogPage;
