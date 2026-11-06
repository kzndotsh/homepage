/** 12345 -> "12,345" (fixed locale so server and client agree). */
export const formatNumber = (n: number) => n.toLocaleString('en-US')
