import { axiosVendor } from "../utils/axios";

export const findAllProvince = async () => await axiosVendor.get("/province");
export const createProvince = async (body) => await axiosVendor.post(`/province`, body);
export const updateProvince = async (id, body) => await axiosVendor.patch(`/province/${id}`, body);
export const deleteProvince = async (id) => await axiosVendor.delete(`/province/${id}`);