import React, {ReactNode, useState} from "react";
import {Button} from "../button";
import {Chip, FormControlLabel, Switch, TextField} from "@mui/material";
import {Product} from "../../api";

interface InvoiceProps {

    id?: string,
    title: ReactNode,
    description: string,
    price: string,
    isRecurring: boolean,
    onButtonClick: () => void
    buttonText?: string,
    outlined?: boolean
}

interface ProductEditFormProps {
    product?: Product,
    title: string,
    buttonText: string,
    onSubmit: (product: Product) => void
}

export const Invoice: React.FC<InvoiceProps> = (props) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '36px',
        border: props.outlined ? '1px solid' : '0',
        minWidth: '20vw',
        padding: '16px',
        borderRadius: '16px'
    }}>
        <div style={{
            display: "flex",
            flexDirection: 'column',
            flexGrow: '1'
        }}>
            {props.title}
            <Chip
                style={{
                    display: props.isRecurring ? 'flex' : 'none'
                }}
                label="Recurring"/>
            <h2>{props.description}</h2>
            <h1>{props.price}&nbsp;$</h1>
        </div>
        <Button
            disabled={false}
            onClick={props.onButtonClick}>
            {props.buttonText}
        </Button>
    </div>
)

export const ProductEditForm: React.FC<ProductEditFormProps> = (props) => {

    const [name, setName] = useState<string>(props.product?.name || '')
    const [description, setDescription] = useState<string>(props.product?.description || '')
    const [price, setPrice] = useState<string>(props.product?.price || '')
    const [isRecurring, setIsRecurring] = useState<boolean>(props.product?.isRecurring || false)

    const id = props.product?.id;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'left',
            padding: '16px 24px',
            minWidth: '350px',
        }}>
            <h1 style={{textAlign: 'center'}}>{props.title}</h1>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '36px'
            }}>
                <TextField
                    id="productName"
                    label="Product name"
                    value={name}
                    variant="standard"
                    onChange={(it) => setName(it.target.value)}
                />
                <TextField
                    id="description"
                    label="Description"
                    variant="outlined"
                    multiline={true}
                    rows={5}
                    value={description}
                    onChange={(it) => setDescription(it.target.value)}
                />
                <TextField
                    id="price"
                    label="Price"
                    variant="standard"
                    value={price}
                    onChange={(it) => setPrice(it.target.value)}
                />
                <FormControlLabel
                    label="Recurring"
                    control={
                        <Switch
                            value={isRecurring}
                            defaultChecked={isRecurring}
                            onChange={(e, checked) => {
                                setIsRecurring(checked)
                            }}
                        />
                    }/>
            </div>
            <Button
                disabled={false}
                onClick={() => {
                    const product: Product = {name, description, price, isRecurring};
                    if (id) {
                        product.id = id
                    }
                    props.onSubmit(product)
                }} children={props.buttonText}></Button>

        </div>
    )
}
