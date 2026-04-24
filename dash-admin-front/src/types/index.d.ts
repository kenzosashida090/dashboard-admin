
declare module '@mui/material/styles' {
    interface PaletteColor {
        [key: number]: string
    }

    interface SimplePaletteColorOptions {
        [key: number]: string
    }
}
declare global {
    interface User {
        name: string
        email: string
        city?: string
        state?: string 
        country: string
        occupation?: string 
        phoneNumber?: string
        transactions: string[] | [],
        role: "admin" | "user" | "superadmin"
        id: string
}
    interface Products {
        _id?: string,
        name: string
        price: number
        description: string
        category: string
        rating: number
        supply: number
        stat?:number
        yearlySalesTotal?:number
        yearlyTotalSoldUnits?:number
    }
type UserSignIn = {
    email:string
    password:string
}


}

export {}