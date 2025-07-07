import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { triggerCompanyCreatedWebhook } from '@/lib/webhook';

export async function POST(request: Request) {
  try {
    const companyData = await request.json();
    
    // Basic validation
    if (!companyData.name) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Check if company already exists
    const existingCompany = await db.collection('companies').findOne({ 
      name: companyData.name 
    });

    if (existingCompany) {
      return NextResponse.json(
        { error: 'A company with this name already exists' },
        { status: 400 }
      );
    }

    // Add timestamps
    const now = new Date();
    const company = {
      ...companyData,
      createdAt: now,
      updatedAt: now,
    };

    // Insert the new company
    const result = await db.collection('companies').insertOne(company);
    
    // Return the created company with its ID
    const createdCompany = {
      _id: result.insertedId,
      ...company
    };

    // Trigger the webhook with the company ID
    try {
      await triggerCompanyCreatedWebhook(createdCompany._id.toString());
    } catch (error) {
      console.error('Failed to trigger company created webhook:', error);
      // Don't fail the request if webhook fails
    }

    return NextResponse.json(createdCompany, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const companies = await db.collection('companies')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await request.json();
    const client = await clientPromise;
    const db = client.db();
    
    const companyData = await request.json();
    
    // Remove _id from the update data to avoid modifying it
    const { _id, ...updateData } = companyData;
    
    const result = await db.collection('companies').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('companies').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting company:', error);
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 }
    );
  }
}
