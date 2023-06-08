import {Header} from "../../component/header";
import React, {useEffect, useState} from "react";
import {createProduct, deleteProduct, editProduct, getProducts, Product} from "../../api";
import {Alert, Dialog, Snackbar, Stack} from "@mui/material";
import {Invoice, ProductEditForm} from "../../component/invoice";
import {Button} from "../../component/button";
import CreateIcon from '@mui/icons-material/Create';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

const invoiceEditButtonStyle: React.CSSProperties = {
    cursor: 'pointer',
    border: 0,
    backgroundColor: 'transparent'
}

export const Admin = () => {

    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(1)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [items, setItems] = useState<Product[]>([])
    const [currentProduct, setCurrentProduct] = useState<Product>()

    useEffect(() => {
        if (hasMore) {
            setPage(page + 1)
            getProducts(page, 10)
                .then(r => {
                    if (r.length === 0) {
                        setHasMore(false)
                        return
                    }
                    setItems(items.concat(r))
                })
        }
        // eslint-disable-next-line
    }, [items])

    const refresh = () => {
        setHasMore(true)
        setItems([])
        setPage(1)
    }
    const deleteItem = (id: string) => {
        deleteProduct(id)
            .then(() => refresh())
    }

    const copyLink = (id: string) => {
        const textArea = document.createElement("textarea");
        textArea.value = `${window.location.origin}/payment/${id}`;
        document.body.appendChild(textArea);
        textArea.focus({preventScroll: true});
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Unable to copy to clipboard', err);
        }
        document.body.removeChild(textArea);
        setSnackbarOpen(true)
    }

    return (
        <div style={{
            minHeight: '100vh',
            minWidth: '100vw',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Header rightItem={<h2>Admin panel</h2>}/>
            <main style={{
                margin: '36px'
            }}>
                <div style={{
                    width: '350px',
                    height: '80px',
                    paddingBottom: '64px'
                }}>
                    <Button
                        disabled={false}
                        onClick={() => {
                            setCurrentProduct(undefined)
                            setCreateDialogOpen(true)
                        }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <span>Create a product</span>
                            <AddIcon/>
                        </div>

                    </Button>
                </div>
                <h1>Products:</h1>
                <Stack direction="row" useFlexGap flexWrap="wrap" gap={'36px'}>
                    {items.map(item => (
                        <Invoice
                            key={item.id}
                            title={
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}>
                                    <h1>{item.name}</h1>
                                    <div>
                                        <button style={invoiceEditButtonStyle} onClick={() => {
                                            setCurrentProduct(item)
                                            setEditDialogOpen(true)
                                        }}>
                                            <CreateIcon/>
                                        </button>
                                        <button style={invoiceEditButtonStyle} onClick={() => deleteItem(item.id!!)}>
                                            <CloseIcon color={'error'}/>
                                        </button>
                                    </div>
                                </div>
                            }
                            description={item.description}
                            price={item.price}
                            isRecurring={item.isRecurring}
                            onButtonClick={() => copyLink(item.id!!)}
                            buttonText={'Copy Payment Link'}
                            outlined={true}
                        />))
                    }
                </Stack>
                <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                    <ProductEditForm
                        product={currentProduct}
                        title={'Edit a product'}
                        buttonText={'Confirm'}
                        onSubmit={product => {
                            editProduct(product)
                                .then(() => {
                                    setEditDialogOpen(false)
                                    refresh()
                                })
                        }}/>
                </Dialog>
                <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
                    <ProductEditForm
                        product={currentProduct}
                        title={'Create a product'}
                        buttonText={'Create a product'}
                        onSubmit={product => {
                            createProduct(product)
                                .then(() => {
                                    setCreateDialogOpen(false)
                                    refresh()
                                })
                        }}/>
                </Dialog>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                >
                    <Alert severity="success">Product link copied!</Alert>
                </Snackbar>
            </main>
        </div>
    )
}
