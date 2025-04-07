import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { getClient } from '../utils.js'; // Import getClient
import { deleteProfileToolParamSchemaType } from './tool-types.js'; // Import the Zod-derived type
import { HyperbrowserError } from '@hyperbrowser/sdk'; // Import SDK error type

// The handler function receives parsed parameters
export async function deleteProfileTool(
  params: deleteProfileToolParamSchemaType
): Promise<CallToolResult> {
  const { profileId } = params; // Destructure validated profileId

  try {
    const client = await getClient(); // Get client instance

    // Call the SDK delete method
    await client.profiles.delete(profileId);

    // Return success
    return {
      content: [
        {
          type: 'text',
          text: `Successfully deleted profile with ID: ${profileId}`,
        },
      ],
      isError: false,
    };
  } catch (error: any) {
    let errorMessage = `An unknown error occurred while deleting profile ${profileId}.`;
    let isError = true;

    // Check if it's a specific Hyperbrowser SDK error
    if (error instanceof HyperbrowserError) {
      if (error.statusCode === 404) {
        errorMessage = `Profile with ID ${profileId} not found.`;
        // Optionally, you might decide this isn't a true 'error' state for the tool
        // isError = false; // Depending on desired behavior
      } else {
        errorMessage = `Failed to delete profile ${profileId}: ${error.message} (Status: ${error.statusCode || 'N/A'})`;
      }
    } else if (error instanceof Error) {
      errorMessage = `Failed to delete profile ${profileId}: ${error.message}`;
    }

    // Return error result
    return {
      content: [{ type: 'text', text: errorMessage }],
      isError: isError,
    };
  }
}

// Export name and description separately for registration
export const deleteProfileToolName = 'delete_profile';
export const deleteProfileToolDescription =
  'Deletes an existing persistent Hyperbrowser profile.';
