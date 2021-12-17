import {
  Link,
  Routes,
  useMutation,
  useSession,
  useRouter,
  validateZodSchema,
  useQuery,
} from "blitz"
import {
  OverflowMenuHorizontal32,
  Notification32,
  NotificationNew32,
  Settings32,
} from "@carbon/icons-react"
import { Listbox, Menu, Popover, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"
import { CheckIcon, SelectorIcon, ChevronDownIcon } from "@heroicons/react/solid"
import moment from "moment"

import { useCurrentUser } from "../hooks/useCurrentUser"
import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace"
import logout from "../../auth/mutations/logout"
import SettingsModal from "../modals/settings"
import changeSessionWorkspace from "../../workspaces/mutations/changeSessionWorkspace"
import QuickDraft from "../../modules/components/QuickDraft"
import getInvitedModules from "../../workspaces/queries/getInvitedModules"

const FullWidthMenu = () => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const router = useRouter()
  const currentWorkspace = useCurrentWorkspace()
  const [invitedModules] = useQuery(getInvitedModules, { session })
  const [logoutMutation] = useMutation(logout)
  const [changeSessionWorkspaceMutation] = useMutation(changeSessionWorkspace)
  // Match the selected state with the session workspace
  const [selected, setSelected] = useState(
    currentUser?.memberships.filter((membership) => {
      if (membership.workspace.id === session.workspaceId) {
        return membership
      }
    })[0]
  )

  if (currentUser && currentWorkspace) {
    return (
      <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
        <Listbox
          value={selected}
          onChange={async (value) => {
            await changeSessionWorkspaceMutation(value?.workspace.id)
            setSelected(value)
          }}
        >
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
              <span className="flex">
                <img
                  className="h-8 w-8 rounded-full"
                  src={selected!.workspace!.avatar!}
                  alt={`Avatar of ${
                    selected!.workspace.name ? selected!.workspace.name : selected!.workspace.handle
                  }`}
                />
                {/* <span className="items-middle"></span> */}
                <span className="inset-y-0 pl-2 right-0 flex items-center pointer-events-none truncate overflow-ellipsis">
                  @{selected!.workspace.handle}
                </span>
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                {currentUser.memberships.map((membership, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      `${active ? "text-indigo-900 bg-indigo-100" : "text-gray-900"}
                      cursor-default select-none relative py-2 pl-10 pr-4`
                    }
                    value={membership}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`${selected ? "font-medium" : "font-normal"} flex truncate`}
                        >
                          <img
                            className="h-7 w-7 rounded-full"
                            src={membership.workspace!.avatar!}
                            alt={`Avatar of ${
                              membership.workspace.name
                                ? membership.workspace.name
                                : membership.workspace.handle
                            }`}
                          />
                          <span
                            className={`${selected ? "font-medium" : "font-normal"} block truncate`}
                          >
                            {membership.workspace.handle}
                          </span>
                          {selected ? (
                            <span
                              className={`${active ? "text-amber-600" : "text-amber-600"}
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                            >
                              <CheckIcon className="w-5 h-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </span>
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={`
                ${open ? "" : "text-opacity-90"}
                ml-5 flex-shrink-0 p-1 text-gray-400 hover:text-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                ${invitedModules.length > 0 ? "" : "pointer-events-none"}
                `}
              >
                <span className="sr-only">View notifications</span>
                {invitedModules.length > 0 ? (
                  <NotificationNew32 className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Notification32 className="h-6 w-6" aria-hidden="true" />
                )}
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute z-10 max-w-72 w-72 bg-gray-300 dark:bg-gray-300 px-4 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0 shadow-2xl">
                  <ul className="divide-y divide-gray-500">
                    {invitedModules.map((invited) => (
                      <>
                        <Link href="/invitations">
                          <li className="cursor-pointer p-2">
                            <p className="text-xs leading-4 text-gray-500">
                              {moment(invited.updatedAt).fromNow()}
                            </p>
                            <p className="text-xs leading-4 font-bold">{invited.title}</p>
                            <p className="text-xs leading-4">Invited to co-author</p>
                          </li>
                        </Link>
                      </>
                    ))}
                  </ul>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        <span className="sr-only">Open settings</span>
        <SettingsModal
          styling="block text-left text-sm text-gray-700 rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 lg:ml-5"
          button={
            <Settings32
              className="h-6 w-6 text-gray-400 hover:text-gray-500 rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-hidden="true"
            />
          }
          user={currentUser}
          workspace={currentWorkspace}
        />
        <Menu as="div" className="flex-shrink-0 relative ml-5">
          <div>
            <Menu.Button className="rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="sr-only">Open user menu</span>
              <OverflowMenuHorizontal32
                className="h-6 w-6 text-gray-400 hover:text-gray-500 "
                aria-hidden="true"
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            {/* TODO: Add keyboard navigation */}
            <Menu.Items className="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
              <Menu.Item key="dropdown-dashboard">
                {({ active }) => (
                  // The Link component doesn't work with Headless
                  <a
                    className={`${active ? "bg-gray-100" : ""}
                    w-full block py-2 px-4 text-left text-sm text-gray-700`}
                    href="/dashboard"
                  >
                    Dashboard
                  </a>
                )}
              </Menu.Item>
              <Menu.Item key="dropdown-profile">
                {({ active }) => (
                  <a
                    className={`${active ? "bg-gray-100" : ""}
                    w-full block py-2 px-4 text-left text-sm text-gray-700`}
                    href={`/${currentWorkspace.handle}`}
                  >
                    Profile
                  </a>
                )}
              </Menu.Item>
              <Menu.Item key="dropdown-logout">
                {({ active }) => (
                  <button
                    className={`${active ? "bg-gray-100" : ""}
                  w-full block py-2 px-4 text-left text-sm text-gray-700`}
                    onClick={async () => {
                      await logoutMutation()
                    }}
                  >
                    Logout
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
        <QuickDraft
          buttonText="Create module"
          buttonStyle="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        />
      </div>
    )
  } else {
    return (
      <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
        <Link href={Routes.LoginPage()}>
          <a className="whitespace-nowrap text-base hover:text-gray-600 dark:hover:text-gray-100 border-2 border-indigo-600 px-4 py-2 text-gray-900 dark:text-white rounded">
            Log in
          </a>
        </Link>
        <Link href={Routes.SignupPage()}>
          <a className="ml-4 2xl:ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base text-white bg-indigo-600 hover:bg-indigo-700">
            Create account
          </a>
        </Link>
      </div>
    )
  }
}

export default FullWidthMenu
