import NiceModal, { useModal } from '@ebay/nice-modal-react'
import Button from 'components/form/button'
import Input from 'components/form/input'
import Select from 'components/form/select'
import Modal from 'components/modal'
import { privateRequest } from 'config/axios.config'
import { useGetSingleAdmin } from 'hooks/admin'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { IoAdd } from 'react-icons/io5'
import { useMutation, useQueryClient } from 'react-query'
import { errorHandler } from 'utils/errorHandler'
import selectBranchModal from './selectBranch.modal'

interface Payload {
  name: string
  phone: string
  role: AdminRole
  branch?: string
}
type Form = {
  name: string
  phone: string
  role?: RoleOption
  branch?: Option
}

interface SubAdminUpdatePayload extends Payload {
  id: string
}

type RoleOption = { label: string; value: AdminRole }

const roleOptions: RoleOption[] = [
  {
    label: 'Hospital Admin',
    value: 'hospitalAdmin',
  },
  {
    label: 'EyeBuddy Admin',
    value: 'eyeBuddyAdmin',
  },
  {
    label: 'Customer Support Manager',
    value: 'customerSupportManager',
  },
]

export default NiceModal.create(({ subAdminId, title }: { subAdminId?: string; title: string }) => {
  const queryClient = useQueryClient()
  const modal = useModal()
  const selectBranch = useModal(selectBranchModal)

  const [form, setForm] = useState<Form>({
    name: '',
    phone: '',
  })

  const [errors, setErrors] = useState<{
    name?: string
    phone?: string
    role?: string
    branch?: string
  }>({})

  const addSubAdmin = useMutation<{ message: string }, Error, Payload>(
    async (payload) => {
      try {
        const res = await privateRequest.post('admin/subAdmin', payload)
        return res.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('subAdmins')
        modal.remove()
      },
    },
  )
  const updateSubAdmin = useMutation<{ message: string }, Error, SubAdminUpdatePayload>(
    async (payload) => {
      try {
        const res = await privateRequest.patch(`admin/subAdmin`, payload)
        return res.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('subAdmins')
        modal.remove()
      },
    },
  )

  const { data, isLoading } = useGetSingleAdmin(subAdminId)

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: data?.name ?? '',
      phone: data?.phone ?? '',
      role: roleOptions.find((role) => role.value === data?.role),
    }))
  }, [data])

  const changeHandler = ({ target: { name, value } }: _ChangeHandlerEvent) => {
    if (name === 'phone' && value.length === 1 && value === '0') return
    if (name === 'phone' && value.length > 10) return

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  const selectHandler = ({ target }: _SelectValue) => {
    setForm((prev) => ({
      ...prev,
      role: roleOptions.find((role) => role.value === target.value.value),
    }))
    setErrors((prev) => ({
      ...prev,
      role: '',
    }))
  }

  const submitHandler = (e: _FormSubmitEvent) => {
    e.preventDefault()

    if (!form.name || !form.phone || !form.role) {
      setErrors((prev) => ({
        ...prev,
        name: !form.name ? 'Name is required' : '',
        phone: !form.phone ? 'Phone is required' : '',
        role: !form.role ? 'Role is required' : '',
      }))
      return
    }

    if (form.phone.length < 10) {
      setErrors((prev) => ({
        ...prev,
        phone: 'Phone number must be 10 digits',
      }))
      return
    }

    const payload: Payload = {
      name: form.name,
      phone: form.phone,
      role: form.role.value,
    }

    if (form.role.value === 'customerSupportManager') {
      if (!form.branch) {
        setErrors((prev) => ({
          ...prev,
          branch: 'Branch is required',
        }))
        return
      }
      payload.branch = form.branch.value
    }

    if (subAdminId) {
      toast.promise(updateSubAdmin.mutateAsync({ ...payload, id: subAdminId }), {
        loading: 'Updating sub admin...',
        success: (res) => res.message ?? 'Sub Admin updated successfully',
        error: (err) => err.message ?? 'Something went wrong!',
      })
    } else {
      toast.promise(addSubAdmin.mutateAsync(payload), {
        loading: 'Adding sub admin...',
        success: (res) => res.message ?? 'Sub Admin added successfully',
        error: (err) => err.message ?? 'Something went wrong!',
      })
    }
  }

  return (
    <Modal
      title={title}
      visible={modal.visible}
      onCancel={() => modal.remove()}
      className='max-w-2xl'
    >
      <form onSubmit={submitHandler} className='flex flex-col gap-6'>
        <Input
          onChange={changeHandler}
          value={form.name}
          name='name'
          placeholder='Enter the full name'
          label='Full Name'
          helpText={errors.name}
          error={!!errors.name}
          disabled={isLoading}
        />
        <Input
          onChange={changeHandler}
          value={form.phone}
          label='Phone'
          type='number'
          name='phone'
          placeholder='1XXXXXXXXX'
          prefix={<span className='mr-2 select-none'>+880</span>}
          helpText={errors.phone}
          error={!!errors.phone}
          disabled={isLoading}
        />
        <Select
          name='role'
          label='Role'
          placeholder='Select a role'
          options={roleOptions}
          value={form.role}
          onChange={selectHandler}
          helpText={errors.role}
          error={!!errors.role}
        />
        {form.role?.value !== 'eyeBuddyAdmin' && (
          <div>
            <label className='inline-block text-sm font-medium text-gray-700'>Select Branch</label>
            <div
              className='cursor-pointer'
              onClick={() =>
                selectBranch.show({ selected: form.branch }).then((res) => {
                  setForm((prev) => ({
                    ...prev,
                    branch: res as Option,
                  }))
                  setErrors((prev) => ({
                    ...prev,
                    branch: '',
                  }))
                })
              }
            >
              {form.branch ? (
                <div className='card border border-gray-4 p-5 mt-1'>{form.branch?.label}</div>
              ) : (
                <div className='card border border-gray-4 text-gray grid place-items-center p-5 mt-1'>
                  <IoAdd />
                </div>
              )}
            </div>

            {errors.branch && (
              <p className='text-red-500 text-sm font-semibold my-1'>{errors.branch}</p>
            )}
          </div>
        )}

        <Button disabled={addSubAdmin.isLoading || updateSubAdmin.isLoading} fullWidth>
          Submit
        </Button>
      </form>
    </Modal>
  )
})
