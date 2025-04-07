import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { getClient } from '../utils.js'; // Import getClient
import { listProfilesToolParamSchemaType } from './tool-types.js'; // Import the Zod-derived type
import { HyperbrowserError } from '@hyperbrowser/sdk'; // Import SDK error type

// The handler function receives parsed parameters (page and limit are optional)
export async function listProfilesTool(
  params: listProfilesToolParamSchemaType
): Promise<CallToolResult> {
  const { page, limit } = params; // Destructure validated optional params

  try {
    const client = await getClient(); // Get client instance

    // Call the SDK list method with optional parameters
    const response = await client.profiles.list({ page, limit });

    // Return the list of profiles and pagination info
    return {
      content: [
        {
          type: 'text',
          // response contains { profiles: ProfileResponse[], totalCount, page, perPage }
          text: JSON.stringify(response, null, 2),
        },
      ],
      isError: false,
    };
  } catch (error: any) {
    let errorMessage = 'An unknown error occurred while listing profiles.';

    // Check if it's a specific Hyperbrowser SDK error
    if (error instanceof HyperbrowserError) {
      errorMessage = `Failed to list profiles: ${error.message} (Status: ${error.statusCode || 'N/A'})`;
    } else if (error instanceof Error) {
      errorMessage = `Failed to list profiles: ${error.message}`;
    }

    // Return error result
    return {
      content: [{ type: 'text', text: errorMessage }],
      isError: true,
    };
  }
}

// Export name and description separately for registration
export const listProfilesToolName = 'list_profiles';
export const listProfilesToolDescription =
  'Lists existing persistent Hyperbrowser profiles, with optional pagination.';
