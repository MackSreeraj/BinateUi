'use client';

import { Building2, Search, Grid, List, Filter, Plus, Image as ImageIcon, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { AddCompanyModal } from './AddCompanyModal';
import { EditCompanyModal } from './EditCompanyModal';

interface Company {
  _id: string;
  name: string;
  about?: string;
  services?: string;
  mission?: string;
  valueProposition?: string;
  painPoints?: string;
  brandVoice?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export default function CompanyProfilesContent() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/companies');
      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }
      const data = await response.json();
      setCompanies(data);
      if (data.length > 0 && !selectedCompany) {
        setSelectedCompany(data[0]);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyAdded = (newCompany: Company) => {
    setCompanies(prev => [newCompany, ...prev]);
    setSelectedCompany(newCompany);
    toast.success('Company added successfully');
  };

  const handleCompanyUpdated = (updatedCompany: Company) => {
    setCompanies(prev => 
      prev.map(company => 
        company._id === updatedCompany._id ? updatedCompany : company
      )
    );
    setSelectedCompany(updatedCompany);
    toast.success('Company updated successfully');
  };

  const handleCompanyDeleted = async (companyId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete company');
      }
      
      setCompanies(prev => prev.filter(company => company._id !== companyId));
      setSelectedCompany(prev => prev?._id === companyId ? null : prev);
      toast.success('Company deleted successfully');
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete company');
      throw error; // Re-throw to be handled by the caller
    }
  };

  const updateCompany = async (updatedCompany: any) => {
    try {
      const response = await fetch(`/api/companies/${updatedCompany._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCompany),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update company');
      }
      
      const data = await response.json();
      handleCompanyUpdated(data);
      return data;
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5" />
          <h1 className="text-2xl font-semibold">COMPANY PROFILES</h1>
        </div>
        <AddCompanyModal onSave={handleCompanyAdded} />
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between pb-4">
        <div className="relative w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8"
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Company List */}
        <div className="w-64 border-r overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : companies.length === 0 ? (
            <div className="text-center p-6 text-muted-foreground">
              <p>No companies found. Add your first company to get started.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {companies.map((company) => (
                <div
                  key={company._id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${
                    selectedCompany?._id === company._id ? 'bg-muted' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedCompany(company)}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-md bg-muted flex items-center justify-center mr-3">
                    {company.logo ? (
                      <img 
                        src={company.logo.startsWith('http') ? company.logo : company.logo.startsWith('/uploads/') ? company.logo : `/uploads/${company.logo}`} 
                        alt={company.name}
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          // If image fails to load, show a placeholder
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '';
                        }}
                      />
                    ) : (
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <span className="font-medium">{company.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel - Company Details */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {selectedCompany ? (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCompany.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      Created on {new Date(selectedCompany.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>

                {/* Logo and About Section */}
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Logo */}
                  <div className="w-full md:w-1/3 space-y-2">
                    <div className="w-full aspect-square rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/20">
                      {selectedCompany.logo ? (
                        <img 
                          src={selectedCompany.logo.startsWith('http') ? selectedCompany.logo : selectedCompany.logo.startsWith('/uploads/') ? selectedCompany.logo : `/uploads/${selectedCompany.logo}`} 
                          alt={selectedCompany.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            // If image fails to load, show a placeholder
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = '';
                          }}
                        />
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">No Logo</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* About Section */}
                  <div className="flex-1">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-primary/80 uppercase tracking-wider mb-2 pb-1 border-b border-muted">About the business</h3>
                      <p className="whitespace-pre-line text-muted-foreground">
                        {selectedCompany.about || 'No information provided.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Company Details */}
                <div className="space-y-6">
                  {selectedCompany.services && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-primary/80 uppercase tracking-wider mb-2 pb-1 border-b border-muted">Services</h3>
                      <p className="text-muted-foreground">{selectedCompany.services}</p>
                    </div>
                  )}

                  {selectedCompany.mission && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-primary/80 uppercase tracking-wider mb-2 pb-1 border-b border-muted">Mission</h3>
                      <p className="text-muted-foreground">{selectedCompany.mission}</p>
                    </div>
                  )}

                  {selectedCompany.valueProposition && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-primary/80 uppercase tracking-wider mb-2 pb-1 border-b border-muted">Unique Value Proposition</h3>
                      <p className="whitespace-pre-line text-muted-foreground">{selectedCompany.valueProposition}</p>
                    </div>
                  )}

                  {selectedCompany.painPoints && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-primary/80 uppercase tracking-wider mb-2 pb-1 border-b border-muted">Client Pain Points</h3>
                      <p className="whitespace-pre-line text-muted-foreground">{selectedCompany.painPoints}</p>
                    </div>
                  )}

                  {selectedCompany.brandVoice && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-primary/80 uppercase tracking-wider mb-2 pb-1 border-b border-muted">Brand Voice</h3>
                      <p className="whitespace-pre-line text-muted-foreground">{selectedCompany.brandVoice}</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Company Selected</h3>
                <p className="text-muted-foreground mb-4">
                  {companies.length > 0 
                    ? 'Select a company from the list or add a new one.'
                    : 'Add your first company to get started.'
                  }
                </p>
                <AddCompanyModal onSave={handleCompanyAdded} />
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedCompany && (
        <EditCompanyModal
          company={selectedCompany}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSave={updateCompany}
          onDelete={handleCompanyDeleted}
        />
      )}
    </div>
  );
}
