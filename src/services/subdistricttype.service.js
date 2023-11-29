import { axiosVendor } from "../utils/axios";

export const findAllSubDistrictType = async () => {    
    return await axiosVendor.get(`/subdistricttype`);
}

// export const searchSubDistrictByName = async (pagingOpts, name) => {
//     const {
//         page = 1,
//         order = 'ASC',
//         take = 10
//     } = pagingOpts
//     return await axiosVendor.get(`/subdistrict/search/${name}?page=${page}&order=${order}&take=${take}`);
// }

// export const createSubDistrict = async (body) => await axiosVendor.post(`/subdistrict`, body);
// export const updateSubDistrict = async (id, body) => await axiosVendor.patch(`/subdistrict/${id}`, body);
// export const deleteSubDistrict = async (id) => await axiosVendor.delete(`/subdistrict/${id}`);