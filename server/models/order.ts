export interface Order {
    id: number;
    userId: number;
    city: string;
    street: string;
    shippingDate: Date;
    dateOrdering: Date;
}