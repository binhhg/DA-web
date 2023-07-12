import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: '217109832798-u2oasqosr3fa40n9nkmfvluq65vrkjbd.apps.googleusercontent.com',
      clientSecret: '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',
      authorization: {
        params: {
          scope: 'email profile https://www.googleapis.com/auth/calendar',
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    })
  ],
  callbacks: {
    async signIn ({ user, account, profile }) {
      if (account.provider === 'google') {
        try {
          const obj = {
            profile: {
              sub: profile.sub,
              email: profile.email,
              name: profile.name,
              picture: profile.picture
            },
            account: {
              refresh_token: account.refresh_token,
              scope: account.scope,
              provider: account.provider,
              providerAccountId: account.providerAccountId
            },
            loginType: 1
          }
          // return `/test?sub=${profile.sub}&email=${profile.email}&name=${profile.name}&picture=${profile.picture}&loginType=1&refresh_token=${account.refresh_token}&scope=${account.scope}&provider=${account.provider}&providerAccountId=${account.providerAccountId}`
          return `/test?res=${encodeURI(JSON.stringify(obj))}`
          // return `/test?oke=${JSON.stringify(obj)}`
        } catch (error) {
          // Xử lý lỗi
          console.error('Lỗi khi gọi API đăng nhập tới backend:', error)
          return '/home'
        }
      }
      return true // Do different verification for other providers that don't have `email_verified`
    }
  },
  theme: {
    logo: 'https://png.pngtree.com/thumb_back/fh260/background/20200714/pngtree-modern-double-color-futuristic-neon-background-image_351866.jpg'
  }
})
