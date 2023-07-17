import { axiosVendor } from "../utils/axios";

export const findAllCity = async () => await axiosVendor.get("/city");
export const createCity = async (body) => await axiosVendor.post(`/city`, body);
export const updateCity = async (id, body) => await axiosVendor.patch(`/city/${id}`, body);
export const deleteCity = async (id) => await axiosVendor.delete(`/city/${id}`);