import { createClient } from "@/lib/supabase/client"

export interface Invoice {
    id: string
    user_id: string
    invoice_number: string
    customer_name: string
    customer_phone?: string
    customer_address?: string
    notes?: string
    items: any[]
    subtotal: number
    tax: number
    tax_amount: number
    total_amount: number
    company_info?: any
    created_at: string
    updated_at: string
}

export interface CreateInvoiceData {
    invoice_number: string
    customer_name: string
    customer_phone?: string
    customer_address?: string
    notes?: string
    items: any[]
    subtotal: number
    tax: number
    tax_amount: number
    total_amount: number
    company_info?: any
}

export const invoiceService = {
    async createInvoice(data: CreateInvoiceData): Promise<{ data: Invoice | null; error: any }> {
        const supabase = createClient()

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return { data: null, error: { message: "User not authenticated" } }
        }

        const { data: invoice, error } = await supabase
            .from("invoices")
            .insert({
                ...data,
                user_id: user.id,
            })
            .select()
            .single()

        return { data: invoice, error }
    },

    async getInvoices(): Promise<{ data: Invoice[] | null; error: any }> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from("invoices")
            .select("*")
            .order("created_at", { ascending: false })

        return { data, error }
    },

    async getInvoiceById(id: string): Promise<{ data: Invoice | null; error: any }> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from("invoices")
            .select("*")
            .eq("id", id)
            .single()

        return { data, error }
    },

    async getInvoiceByNumber(invoiceNumber: string): Promise<{ data: Invoice | null; error: any }> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from("invoices")
            .select("*")
            .eq("invoice_number", invoiceNumber)
            .single()

        return { data, error }
    },

    async updateInvoice(id: string, updates: Partial<CreateInvoiceData>): Promise<{ data: Invoice | null; error: any }> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from("invoices")
            .update(updates)
            .eq("id", id)
            .select()
            .single()

        return { data, error }
    },

    async deleteInvoice(id: string): Promise<{ error: any }> {
        const supabase = createClient()

        const { error } = await supabase.from("invoices").delete().eq("id", id)

        return { error }
    },
}
