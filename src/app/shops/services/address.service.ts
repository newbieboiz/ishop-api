import { District, Province, Ward } from '@prisma/client';

import { NotFoundException } from '@/common/exceptions';
import db from '@/lib/database';

import { AddressPayload, ImportProvincesPayload } from '../schemas';

export class AddressService {
  public importProvinces = async (payload: ImportProvincesPayload) => {
    await db.ward.deleteMany();
    await db.district.deleteMany();
    await db.province.deleteMany();

    const wards: Omit<Ward, 'id'>[] = [];
    const districts: Omit<District, 'id'>[] = [];
    const provinces: Omit<Province, 'id'>[] = payload.provinces.map((province) => {
      province.districts.forEach((district) => {
        districts.push({
          provinceCode: province.code,
          code: district.code,
          name: district.name,
        });

        district.wards.forEach((ward) => {
          wards.push({
            districtCode: district.code,
            code: ward.code,
            name: ward.name,
          });
        });
      });

      return {
        code: province.code,
        name: province.name,
      };
    });

    await db.province.createMany({
      data: provinces,
      skipDuplicates: true,
    });
    await db.district.createMany({
      data: districts,
      skipDuplicates: true,
    });
    await db.ward.createMany({
      data: wards,
      skipDuplicates: true,
    });
  };

  public extractProvinces = async () => {
    const provinces = await db.province.findMany();
    const districts = await db.district.findMany();
    const wards = await db.ward.findMany();

    return {
      provinces,
      districts,
      wards,
    };
  };

  public findMany = async ({ userId }: { userId: string }) => {
    return await db.address.findMany({
      where: {
        userId,
      },
    });
  };

  public findUnique = async ({ userId, addressId }: { userId: string; addressId: string }) => {
    const address = await db.address.findUnique({
      where: {
        userId,
        id: addressId,
      },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return address;
  };

  public create = async (payload: AddressPayload, { userId }: { userId: string }) => {
    return await db.address.create({
      data: {
        userId,
        ...payload,
      },
    });
  };

  public update = async (payload: AddressPayload, { userId, addressId }: { userId: string; addressId: string }) => {
    return await db.address.update({
      where: {
        userId,
        id: addressId,
      },
      data: payload,
    });
  };

  public delete = async ({ userId, addressId }: { userId: string; addressId: string }) => {
    return await db.address.delete({
      where: {
        userId,
        id: addressId,
      },
    });
  };
}
