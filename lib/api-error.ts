export class ApiRequestError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.details = details;
  }
}

export class NotImplementedError extends Error {
  constructor(feature: string) {
    super(`${feature} is not available yet. This feature has not been connected to the backend.`);
    this.name = 'NotImplementedError';
  }
}

export function notImplemented(feature: string): never {
  throw new NotImplementedError(feature);
}

interface FastApiValidationDetail {
  msg?: string;
  loc?: Array<string | number>;
}

export async function parseApiErrorResponse(response: Response): Promise<never> {
  let message = `Request failed (${response.status})`;
  let details: unknown;

  try {
    const body = await response.json();
    details = body;

    if (typeof body.detail === 'string') {
      message = body.detail;
    } else if (Array.isArray(body.detail)) {
      message = body.detail
        .map((entry: FastApiValidationDetail) => entry.msg ?? 'Validation error')
        .join(', ');
    } else if (typeof body.message === 'string') {
      message = body.message;
    }
  } catch {
    // Response body is not JSON — keep default message.
  }

  throw new ApiRequestError(message, response.status, details);
}
