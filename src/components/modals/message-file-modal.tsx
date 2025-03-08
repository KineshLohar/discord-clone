'use client'

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import axios from 'axios'
import { useEffect, useState } from 'react';
import qs from 'query-string'
import { useRouter } from 'next/navigation';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { FileUpload } from '../file-upload';
import { useModal } from '@/hooks/use-modal-store';


const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: "Attachement is required"
    })
})

const MessageFileModal = () => {
    const { onClose, isOpen, type, data } = useModal();
    const { apiUrl, query } = data;
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: ''
        }
    })
    const isModalOpen = isOpen && type === "messageFile";

    const router = useRouter();

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || '',
                query
            })
            await axios.post(url, {
                ...values,
                content: values?.fileUrl
            })

            form.reset();
            router.refresh();
            onClose();

        } catch (error) {
            console.log('Error submitting', error);

        }
    }
    const handleClose = () => {
        form.reset();
        handleClose()
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className=" bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className=" text-2xl text-center font-bold">
                        Add a attachment
                    </DialogTitle>
                    <DialogDescription className=" text-center text-zinc-500">
                        send a file as a message
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className=' space-y-6'>
                        <div className='space-y-8 px-6'>
                            <div className='flex items-center justify-center text-center'>
                                <FormField
                                    name='fileUrl'
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint='messageFile'
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter className='bg-gray-100 px-6 py-4'>
                            <Button variant='primary' disabled={isLoading}>Send</Button>
                        </DialogFooter>
                    </form>

                </Form>
            </DialogContent>

        </Dialog>
    )
}

export default MessageFileModal;