import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { getClient } from '../utils.js'; // Import getClient
import { HyperbrowserError } from '@hyperbrowser/sdk'; // Import SDK error type

// The handler function receives no specific parameters for create
// but we define it to match the expected signature by the server setup
export async function createProfileTool(
  params: {} // No parameters expected based on schema
): Promise<CallToolResult> {
  try {
    const client = await getClient(); // Get client instance

    // Call the SDK create method
    const response = await client.profiles.create(); // response is { id: string }

    // Return success with the profile ID
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
      isError: false,
    };
  } catch (error: any) {
    let errorMessage = 'An unknown error occurred while creating the profile.';

    // Check if it's a specific Hyperbrowser SDK error
    if (error instanceof HyperbrowserError) {
      errorMessage = `Failed to create profile: ${error.message} (Status: ${error.statusCode || 'N/A'})`;
    } else if (error instanceof Error) {
      errorMessage = `Failed to create profile: ${error.message}`;
    }

    // Return error result
    return {
      content: [{ type: 'text', text: errorMessage }],
      isError: true,
    };
  }
}

// Export name and description separately for registration
export const createProfileToolName = 'create_hyperbrowser_profile';
export const createProfileToolDescription =
  'Creates a new persistent Hyperbrowser profile.';
