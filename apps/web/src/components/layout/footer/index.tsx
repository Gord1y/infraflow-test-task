const Footer: React.FC = () => {
  return (
    <footer className='my-4 flex w-full flex-row flex-wrap justify-between md:my-10 lg:my-16'>
      <div className='flex w-full flex-col items-center justify-center gap-2 px-4 md:px-8 lg:px-16'>
        <div className='bg-foreground/50 h-px w-full max-w-xl rounded-2xl' />
        <div className='flex w-full flex-col items-center justify-center gap-2 md:flex-row md:gap-4'>
          <span className='text-foreground/50 text-sm'>
            © {new Date().getFullYear()} Ifraflow Test Task
          </span>
          <span className='text-foreground/50 text-sm'>
            Made with ❤️ by{' '}
            <a
              href='https://gord1y.dev'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary font-semibold hover:underline'
            >
              Gord1y
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
