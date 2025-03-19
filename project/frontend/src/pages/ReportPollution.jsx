import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchReports,
  addReport,
  deleteReport,
  editReport,
} from "../redux/features/repPollutionSlice";
import { BsFillTrash3Fill, BsPencilFill } from "react-icons/bs";

const ReportPollution = () => {
  const dispatch = useDispatch();
  const { pollutions, status } = useSelector((state) => state.pollution);
  const [editingReport, setEditingReport] = useState(null);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const pollutionType = watch("pollutionType");

  const pollutionOptions = [
    "Industrial Emissions",
    "Vehicle Emissions",
    "Construction Dust",
    "Burning Waste",
    "Indoor Air Quality Issues",
    "Other",
  ];

  const onSubmit = (data) => {
    const newReport = {
      description: data.description,
      location: data.location,
      pollutionType:
        data.pollutionType === "Other" ? data.customType : data.pollutionType,
      date: editingReport ? editingReport.date : new Date().toLocaleString(),
    };

    if (editingReport) {
      dispatch(editReport({ ...newReport, id: editingReport._id }));
    } else {
      dispatch(addReport(newReport));
    }

    // Reset the form and clear the editing state
    setEditingReport(null);
    reset({
      description: "",
      location: "",
      pollutionType: "",
      customType: "",
    });
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    reset({
      description: report.description,
      location: report.location,
      pollutionType: pollutionOptions.includes(report.pollutionType)
        ? report.pollutionType
        : "Other",
      customType: !pollutionOptions.includes(report.pollutionType)
        ? report.pollutionType
        : "",
    });
  };

  return (
    <div className="pt-16 bg-background dark:bg-background dark:text-[#E4E4E7] min-h-screen">
      <div className="bg-surfaceColor p-2 m-2">
        <h1 className="text-base md:text-lg font-semibold text-center uppercase">
          Report Pollution
        </h1>
      </div>

      {/* Form */}
      <div className="bg-surfaceColor p-4 m-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-background p-6 rounded-lg shadow-md space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold mb-1">
              Description:
            </label>
            <textarea
              placeholder="Provide details about the pollution incident (e.g., Thick black smoke from a factory at noon)."
              {...register("description", {
                required: "Description is required",
              })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Location:
            </label>
            <input
              type="text"
              placeholder="e.g., 123 Main Street, Karachi"
              {...register("location", {
                required: "Location is required",
                minLength: {
                  value: 3,
                  message: "Location must be at least 3 characters long",
                },
                maxLength: {
                  value: 100,
                  message: "Location must be under 100 characters",
                },
                pattern: {
                  value: /^[A-Za-z0-9\s,-]+$/,
                  message:
                    "Only letters, numbers, commas, and hyphens are allowed",
                },
              })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700"
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Pollution Type:
            </label>
            <select
              {...register("pollutionType", {
                required: "Please select a pollution type",
              })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700"
            >
              <option value="">Select Pollution Type</option>
              {pollutionOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.pollutionType && (
              <p className="text-red-500 text-sm">
                {errors.pollutionType.message}
              </p>
            )}
          </div>

          {pollutionType === "Other" && (
            <div>
              <label className="block text-sm font-semibold mb-1">
                Specify Pollution Type:
              </label>
              <input
                type="text"
                {...register("customType", {
                  required: "Specify the type of pollution",
                })}
                className="w-full p-2 border rounded-lg dark:bg-gray-700"
              />
              {errors.customType && (
                <p className="text-red-500 text-sm">
                  {errors.customType.message}
                </p>
              )}
            </div>
          )}

          <button
        
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 "
          >
            {editingReport ? "Update Report" : "Submit Report"}
          </button>
        </form>
      </div>

      <div className="p-2">
        <div className="bg-surfaceColor p-2">
          <h3 className="text-base md:text-lg font-semibold text-center uppercase">
            Reported Pollution Cases
          </h3>
        </div>
        {pollutions.length === 0 ? (
          <p className="text-gray-500">No pollutions submitted yet.</p>
        ) : (
          <div className="relative overflow-x-auto border border-primaryText/20 rounded-t-3xl mt-4 mx-3 ">
            <table className="w-full text-sm">
              <thead className="text-xs text-gray-900 uppercase bg-primaryBtnText/20 dark:bg-primaryBtnText/50">
                <tr>
                  <th className="px-6 py-3 text-center">Pollution Type</th>
                  <th className="px-6 py-3 text-center">Description</th>
                  <th className="px-6 py-3 text-center">Location</th>
                  <th className="px-6 py-3 text-center">Date</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-surfaceColor divide-y divide-gray-200">
                {pollutions.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-4 text-center">
                      {report.pollutionType}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {report.description}
                    </td>
                    <td className="px-4 py-4 text-center">{report.location}</td>
                    <td className="px-4 py-4 text-center">{report.date}</td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleEdit(report)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        <BsPencilFill className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => dispatch(deleteReport(report._id))}
                        className="text-red-600 hover:text-red-800"
                      >
                        <BsFillTrash3Fill className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPollution;