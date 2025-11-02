import clsx from 'clsx'
import NoData from 'components/NoData'
import Skeleton from 'components/Skeleton'
import { privateRequest } from 'config/axios.config'
import { AuthContext } from 'context/AuthContext'
import { SupportContext } from 'context/supportContext'
import moment from 'moment'
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { BsSend } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import { MdAttachFile } from 'react-icons/md'
import { useMutation, useQuery } from 'react-query'
import socket from 'socket/socket'
import { errorHandler } from 'utils/errorHandler'
import { assetUrl } from 'utils/url'
import { AttachmentCard } from './components/attachmentCard'

export default function OngoingMessages() {
  const { customer } = useContext(SupportContext)
  const { user } = useContext(AuthContext)

  const [message, setMessage] = useState('')
  const [file, setFile] = useState<File>()
  const [messages, setMessages] = useState<SupportMessage[]>([])

  const { data, isLoading } = useQuery<SupportMessage[], Error>(
    ['messages', customer?._id],
    async () => {
      try {
        const res = await privateRequest.get(`admin/support/messages/${customer?._id}?limit=-1`)
        return res.data.data.docs
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      enabled: !!customer?._id,
      refetchOnWindowFocus: true,
      staleTime: 1000 * 30,
    },
  )

  useEffect(() => {
    if (!data?.length) return
    setMessages(data)
  }, [data])

  const sendMessage = useMutation<{ message: string }, Error, FormData>(
    async (payload) => {
      try {
        const res = await privateRequest.post('admin/support/submit', payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        return res.data
      } catch (err) {
        errorHandler(err)
      }
    },
    {
      onSuccess: () => {
        setMessage('')
        setFile(undefined)
      },
    },
  )

  const fileChangeHandler = (e: _ChangeHandlerEvent) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = (e: _FormSubmitEvent) => {
    e.preventDefault()
    if (sendMessage.isLoading || !(file || message)) return

    const formData = new FormData()
    formData.append('content', message)
    formData.append('contentType', file ? 'attachment' : 'text')
    formData.append('supportId', customer?._id ?? '')
    if (file) {
      formData.append('attachment', file)
    }

    sendMessage.mutate(formData)
  }

  const ref = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  }

  useEffect(() => {
    if (!customer?._id) return
    socket.on('connect', () => {
      console.log('connected')
    })
    socket.emit('joinSupportRoom', {
      supportId: customer?._id,
    })
    socket.on('newSupportMessage', (data) => {
      setMessages((prev) => [data, ...prev])
    })

    return () => {
      socket.emit('leaveSupportRoom', {
        supportId: customer?._id,
      })
      socket.off('newSupportMessage')
    }
  }, [customer?._id])

  useLayoutEffect(() => {
    scrollToBottom()
  }, [messages?.length])

  if (!customer?._id) return null

  return (
    <div className='relative before:h-2 before:w-full before:absolute before:left-0 before:top-0 before:bg-gradient-to-b before:from-white before:to-transparent before:backdrop-blur-[1px]'>
      <div
        ref={ref}
        className={clsx(
          'h-[calc(100vh-370px)] overflow-y-auto mt-5 mb-5 flex flex-col-reverse gap-5',
        )}
      >
        {isLoading &&
          Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className='flex items-center gap-5'>
                <div className='h-16 w-16 rounded-full bg-slate-200' />
                <div className='flex-1'>
                  <div className='flex gap-5 mb-3 items-end'>
                    <Skeleton className='h-4 w-28' />
                    <Skeleton className='h-2 w-20' />
                  </div>
                  <Skeleton className='h-2 w-full mb-1' />
                  <Skeleton className='h-2 w-full mb-1' />
                  <Skeleton className='h-2 w-full' />
                </div>
              </div>
            ))}

        {!isLoading &&
          messages?.map((row) => (
            <div
              key={row._id}
              className={clsx('inline-flex gap-5', {
                'bg-primary/10 max-w-[80%] ml-auto mr-2 p-2 rounded-md flex-row-reverse':
                  row.senderType === 'admin',
                'bg-black/10 max-w-[80%] ml-2 mr-auto p-2 rounded-md': row.senderType !== 'admin',
              })}
            >
              {row.senderType === 'admin' ? (
                <>
                  {user?.photo ? (
                    <img
                      src={assetUrl + user?.photo}
                      className='h-10 w-10 rounded-full overflow-hidden object-cover'
                      alt=''
                    />
                  ) : (
                    <div className='h-10 w-10 rounded-full bg-slate-200 text-green-500 flex place-items-center text-xl justify-center uppercase'>
                      {user?.name?.split(' ').map((n) => n[0])}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {customer.user?.photo ? (
                    <img
                      src={assetUrl + customer.user?.photo}
                      className='h-10 w-10 rounded-full overflow-hidden object-cover'
                      alt=''
                    />
                  ) : (
                    <div className='h-10 w-10 rounded-full bg-slate-200' />
                  )}
                </>
              )}

              <div className='flex-1'>
                <h2 className='text-base font-medium mb-1 capitalize'>
                  {/* {row.senderType === 'admin' ? (
                    <span className='text-primary'>{user?.name}</span>
                  ) : (
                    customer.user?.name
                  )} */}
                  <span className='text-xs text-gray'>
                    {moment.utc(row.createdAt).format('MMMM DD, HH:MM A')}
                  </span>
                </h2>
                <AttachmentCard row={row} />
              </div>
            </div>
          ))}
        {!messages?.length && !isLoading && <NoData />}
      </div>
      {file && (
        <p className='inline-flex justify-between items-center gap-3 text-right text-slate-600 p-1 pl-3 rounded-full bg-slate-200 text-sm mb-2 uppercase font-medium'>
          {file?.name?.length > 25 && '...'}
          {file?.name?.slice(-25)}
          <span
            onClick={() => setFile(undefined)}
            className='h-6 w-6 cursor-pointer flex items-center justify-center rounded-full bg-primary text-white'
          >
            <IoClose size={18} />
          </span>
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        className='flex justify-between shadow-small-card rounded-lg relative z-10'
      >
        <button
          className={clsx('absolute right-0 top-0 h-full w-16 grid place-items-center', {
            'bg-gray-200 cursor-wait': sendMessage.isLoading,
          })}
        >
          <div
            className={clsx(
              'absolute m-auto h-12 w-12 border border-slate-200 rounded-full spinning invisible opacity-0 transition-all',
              {
                '!visible opacity-100': sendMessage.isLoading,
              },
            )}
          >
            <span className='absolute left-1/2 -top-1 h-2 w-2 bg-primary rounded-full'></span>
          </div>
          <BsSend className='text-gray' size={22} />
        </button>
        <input
          disabled={sendMessage.isLoading}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Write your message'
          className='h-16 w-full outline-none bg-transparent pl-5 border-none'
          type='text'
        />

        <label
          htmlFor='attachment'
          className='flex items-center border-r border-slate-100 m-0 justify-center w-10 h-16 mr-16'
        >
          <MdAttachFile size={25} className='cursor-pointer' />
          <input
            onChange={fileChangeHandler}
            id='attachment'
            className='hidden'
            type='file'
            accept='image/*'
          />
        </label>
      </form>
    </div>
  )
}
