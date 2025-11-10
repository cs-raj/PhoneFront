import { type NextRequest, NextResponse } from "next/server";
import { createFeedbackEntry, getFeedbackEntries } from "@/lib/contentstack-management";

export async function POST(request: NextRequest) {
  console.log('🚀 [FEEDBACK API] ==========================================');
  console.log('🚀 [FEEDBACK API] FEEDBACK API CALLED - STARTING REQUEST');
  console.log('🚀 [FEEDBACK API] ==========================================');
  
  try {
    const body = await request.json();
    console.log('🚀 [FEEDBACK API] Request body:', JSON.stringify(body, null, 2));

    // Validate required fields
    if (!body.title || !body.email) {
      return NextResponse.json(
        { error: "Title and email are required" },
        { status: 400 }
      );
    }

    // Prepare feedback data for Contentstack
    const feedbackData = {
      title: body.title,
      email: body.email,
      message: body.message || "",
      feedback_type: body.feedback_type || "",
      // Add additional metadata
      status: "new",
      created_at: new Date().toISOString(),
      source: "contact_form"
    };

    console.log('🚀 [FEEDBACK API] Prepared feedback data:', JSON.stringify(feedbackData, null, 2));

    // Create entry in Contentstack using Management SDK
    const result = await createFeedbackEntry(feedbackData);

    console.log('✅ [FEEDBACK API] Feedback submitted successfully:', result);
    
    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
      data: {
        id: result.uid,
        title: feedbackData.title,
        status: "received"
      }
    });

  } catch (error) {
    console.error('❌ [FEEDBACK API] Error processing feedback:', error);
    console.error('❌ [FEEDBACK API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        error: "Failed to submit feedback",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve feedback (for admin purposes)
export async function GET(request: NextRequest) {
  console.log('🚀 [FEEDBACK API] GET request received');
  
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? "10");
    const skip = Number(searchParams.get("skip") ?? "0");

    const result = await getFeedbackEntries(limit, skip);
    
    return NextResponse.json({
      success: true,
      items: result.entries,
      total: result.total,
      count: result.count
    });
  } catch (error) {
    console.error('❌ [FEEDBACK API] Error fetching feedback:', error);
    return NextResponse.json(
      { 
        error: "Failed to fetch feedback",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
