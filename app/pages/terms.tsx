import { BlitzPage, useQuery, useRouter, useSession } from "blitz"
import Layout from "app/core/layouts/Layout"
import Markdown from "markdown-it"

import Navbar from "../core/components/Navbar"
import Footer from "../core/components/Footer"
import LayoutLoader from "app/core/components/LayoutLoader"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"

const termsMarkdown = `
# Terms of use

`

const md = new Markdown()

const TermsPage: BlitzPage = () => {
  const datetime = new Date()
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts, { refetch }] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })

  return (
    <>
      <Navbar
        currentUser={currentUser}
        session={session}
        currentWorkspace={currentWorkspace}
        router={router}
        drafts={drafts}
        invitations={invitations}
        refetchFn={refetch}
      />
      <main className="lg:relative bg-white dark:bg-gray-900">
        <div className="mx-4 lg:mx-auto max-w-3xl text-black dark:text-white my-8">
          <div
            className="coc "
            dangerouslySetInnerHTML={{ __html: md.render(termsMarkdown) }}
          ></div>
        </div>
      </main>
      <Footer />
    </>
  )
}

TermsPage.suppressFirstRenderFlicker = true
TermsPage.getLayout = (page) => (
  <Layout title="R= Terms of use">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default TermsPage