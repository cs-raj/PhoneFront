// Initialize Contentstack Management SDK only if token is available
let managementAPIClient: any = null;
let stack: any = null;

try {
  if (process.env.CONTENTSTACK_MANAGEMENT_TOKEN) {
    const Contentstack = require("@contentstack/management");
    managementAPIClient = Contentstack.client({
      authtoken: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
    });

    stack = managementAPIClient.stack({
      api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || "",
      management_token: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
    });
  }
} catch (error) {
  console.warn('Contentstack Management SDK not available:', error);
}

export const createFeedbackEntry = async (feedbackData: {
  title: string;
  email: string;
  message?: string;
  feedback_type?: string;
}) => {
  console.log('🔧 [CONTENTSTACK MANAGEMENT] Creating feedback entry:', feedbackData);

  try {
    // Create entry in the feedback content type
    const entry = await stack
      .contentType("feedback")
      .entry()
      .create({
        entry: {
          title: feedbackData.title,
          email: feedbackData.email,
          message: feedbackData.message || "",
          feedback_type: feedbackData.feedback_type || "",
          status: "new",
          created_at: new Date().toISOString(),
          source: "contact_form"
        }
      });

    console.log('✅ [CONTENTSTACK MANAGEMENT] Feedback entry created successfully:', entry.uid);
    return {
      success: true,
      uid: entry.uid,
      entry: entry
    };
  } catch (error) {
    console.error('❌ [CONTENTSTACK MANAGEMENT] Error creating feedback entry:', error);
    console.error('❌ [CONTENTSTACK MANAGEMENT] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    throw new Error(`Failed to create feedback entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getFeedbackEntries = async (limit: number = 10, skip: number = 0) => {
  console.log('🔧 [CONTENTSTACK MANAGEMENT] Fetching feedback entries:', { limit, skip });

  try {
    const entries = await stack
      .contentType("feedback")
      .entry()
      .query()
      .limit(limit)
      .skip(skip)
      .find();

    console.log('✅ [CONTENTSTACK MANAGEMENT] Feedback entries fetched successfully:', entries.count);
    return {
      success: true,
      entries: entries.entries,
      count: entries.count,
      total: entries.count
    };
  } catch (error) {
    console.error('❌ [CONTENTSTACK MANAGEMENT] Error fetching feedback entries:', error);
    throw new Error(`Failed to fetch feedback entries: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const updateFeedbackEntry = async (uid: string, updateData: any) => {
  console.log('🔧 [CONTENTSTACK MANAGEMENT] Updating feedback entry:', { uid, updateData });

  try {
    const entry = await stack
      .contentType("feedback")
      .entry(uid)
      .update({
        entry: updateData
      });

    console.log('✅ [CONTENTSTACK MANAGEMENT] Feedback entry updated successfully:', uid);
    return {
      success: true,
      uid: entry.uid,
      entry: entry
    };
  } catch (error) {
    console.error('❌ [CONTENTSTACK MANAGEMENT] Error updating feedback entry:', error);
    throw new Error(`Failed to update feedback entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const deleteFeedbackEntry = async (uid: string) => {
  console.log('🔧 [CONTENTSTACK MANAGEMENT] Deleting feedback entry:', uid);

  try {
    await stack
      .contentType("feedback")
      .entry(uid)
      .delete();

    console.log('✅ [CONTENTSTACK MANAGEMENT] Feedback entry deleted successfully:', uid);
    return {
      success: true,
      uid: uid
    };
  } catch (error) {
    console.error('❌ [CONTENTSTACK MANAGEMENT] Error deleting feedback entry:', error);
    throw new Error(`Failed to delete feedback entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
