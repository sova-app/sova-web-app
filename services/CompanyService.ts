import { DataSourceFactory } from "@/data/DataSourceFactory";
import { Company } from "@/data/repositories/IRepository";
import { CreateCompanyDto } from "@/dto/createCompanyDto";
import { UpdateCompanyDto } from "@/dto/updateCompanyDto";

export class CompanyService {
  private repository = DataSourceFactory.getRepository();

  getCompanies = async (): Promise<Company[]> => {
    return await this.repository.getCompanies();
  };

  createCompany = async (companyDto: CreateCompanyDto): Promise<Company> => {
    return await this.repository.createCompany(companyDto);
  };
  updateCompany = async (companyDto: UpdateCompanyDto): Promise<Company> => {
    return await this.repository.updateCompany(companyDto);
  };
}
