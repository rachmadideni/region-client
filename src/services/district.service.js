import { axiosVendor } from "../utils/axios";

// export const findAllDistrict = async (pagingOpts) => {
//     const {
//         page = 1,
//         order = 'ASC',
//         take = 10
//     } = pagingOpts
//     return await axiosVendor.get(`/district?page=${page}&order=${order}&take=${take}`);
// }

export const searchDistrictByName = async (pagingOpts, name) => {
    const {
        page = 1,
        order = 'ASC',
        take = 10
    } = pagingOpts
    return await axiosVendor.get(`/district/search/${name}?page=${page}&order=${order}&take=${take}`);
}


export const findAllDistrict = async () => await axiosVendor.get(`/district`);
export const findDistrictByOid = async (oid) => await axiosVendor.get(`/district/search/oid/${oid}`);

export const createDistrict = async (body) => await axiosVendor.post(`/district`, body);
export const updateDistrict = async (id, body) => await axiosVendor.patch(`/district/${id}`, body);
export const deleteDistrict = async (id) => await axiosVendor.delete(`/district/${id}`);