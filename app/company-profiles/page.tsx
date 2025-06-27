'use client';

import { Building2, Search, Grid, List, Filter, Image as ImageIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function CompanyProfilesPage() {
  const companies = [
    { id: 1, name: 'Nvidia', logo: '/nvidia-logo.png' },
    { id: 2, name: 'AMD', logo: '/amd-logo.png' },
  ];

  const [selectedCompany, setSelectedCompany] = useState(companies[0]);
  const [companyName, setCompanyName] = useState(selectedCompany?.name || '');
  const [about, setAbout] = useState('');
  const [service, setService] = useState('');
  const [mission, setMission] = useState('');
  const [valueProp, setValueProp] = useState('');
  const [painPoints, setPainPoints] = useState('');
  const [brandVoice, setBrandVoice] = useState('');

  return (
    <div className="flex h-full">
      {/* Left Panel - Company List */}
      <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Companies
          </h2>
          <Button size="icon" className="h-8 w-8 rounded-md">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search companies..."
            className="w-full rounded-lg bg-background pl-8 h-9"
          />
        </div>

        <div className="space-y-1">
          {companies.map((company) => (
            <div
              key={company.id}
              className={`p-3 rounded-md cursor-pointer transition-colors ${
                selectedCompany?.id === company.id ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedCompany(company)}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="h-6 w-6 object-contain" />
                  ) : (
                    <Building2 className="h-4 w-4 text-gray-500" />
                  )}
                </div>
                <span className="font-medium">{company.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedCompany && (
          <>
            {/* Header */}
            <div className="border-b p-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Company Profile</h1>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="h-9">
                    <Grid className="h-4 w-4 mr-2" />
                    Grid
                  </Button>
                  <Button variant="outline" size="sm" className="h-9">
                    <List className="h-4 w-4 mr-2" />
                    List
                  </Button>
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                {/* Company Name */}
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="text-2xl font-semibold border-0 p-0 mb-6 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none border-b"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Column - Logo */}
                  <div className="space-y-4">
                    <div className="h-48 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                      {selectedCompany.logo ? (
                        <img src={selectedCompany.logo} alt={selectedCompany.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">Company Logo</p>
                        </div>
                      )}
                    </div>
                    <Button variant="outline" className="w-full">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                  </div>

                  {/* Right Column - Details */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">About the business</label>
                      <Textarea 
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder="Brief description of what your company does..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">What Service do you offer?</label>
                      <Input 
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        placeholder="E.g., AI Hardware, Software Solutions"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mission of the business</label>
                      <Textarea 
                        value={mission}
                        onChange={(e) => setMission(e.target.value)}
                        placeholder="Your company's mission statement..."
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Unique Value Proposition</label>
                      <Textarea 
                        value={valueProp}
                        onChange={(e) => setValueProp(e.target.value)}
                        placeholder="What makes your company unique?"
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Ideal client's top three pain points</label>
                      <Textarea 
                        value={painPoints}
                        onChange={(e) => setPainPoints(e.target.value)}
                        placeholder="List the main challenges your clients face..."
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">How do you want to come across to your target audience?</label>
                      <Textarea 
                        value={brandVoice}
                        onChange={(e) => setBrandVoice(e.target.value)}
                        placeholder="Describe your brand voice and tone..."
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
