'use client'

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import axios from 'axios';
import qs from 'query-string'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useParams, useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';
import { useEffect, useState } from 'react';
import { ChannelType } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Channel name is required"
    }).toLowerCase().refine(name => name !== 'general', {
        message: "Channel name cannot 'general'"
    }),
    type: z.nativeEnum(ChannelType)
})

export const EditChannelModal = () => {
    const router = useRouter();
    const params = useParams()
    const { isOpen, type, onClose, data } = useModal();
    const { channel, server } = data;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            type: channel?.type || ChannelType.TEXT
        }
    })

    useEffect(() => {
       if(channel){
        form.setValue("name", channel.name)
        form.setValue("type", channel.type)
       }
    },[form, channel])

    const isModalOpen = isOpen && type === 'editChannel'
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            })
            await axios.patch(url, values)
            form.reset();
            router.refresh();
            onClose()
        } catch (error) {
            console.log('Error submitting', error);
        }
    }

    const handleClose = () => {
        form.reset()
        onClose()
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className=" bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className=" text-2xl text-center font-bold">
                        Edit Channel
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className=' space-y-6'>
                        <div className='space-y-8 px-6'>
                            <FormField
                                name='name'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className=' uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                                            Channel Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                                                disabled={isLoading}
                                                placeholder='Enter server name'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='type'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Channel Type</FormLabel>
                                        <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className=' bg-zinc-300/50 focus:ring-0 border-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none'>
                                                    <SelectValue placeholder='Select your channel type' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(ChannelType).map((type) => (
                                                    <SelectItem
                                                    key={type}
                                                    value={type}
                                                    className=' capitalize'
                                                    >
                                                        {type.toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className='bg-gray-100 px-6 py-4'>
                            <Button variant='primary' disabled={isLoading}>Save</Button>
                        </DialogFooter>
                    </form>

                </Form>
            </DialogContent>
        </Dialog>
    )
}
