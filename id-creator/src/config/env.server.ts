import 'server-only'

function required(name: string): string {
    const value = process.env[name]
    if (!value) throw new Error(`Missing environment variable ${name}`)
    return value
}

// Server-only values. Importing this from a client component fails the build.
export const serverEnv = {
    get apiUrl() { return required("API_URL") },
}
