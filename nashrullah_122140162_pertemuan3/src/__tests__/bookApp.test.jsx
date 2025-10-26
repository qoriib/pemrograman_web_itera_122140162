import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx'
import { BookProvider } from '../context/BookContext.jsx'

const renderWithProviders = (initialEntries = ['/']) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <BookProvider>
        <App />
      </BookProvider>
    </MemoryRouter>,
  )

beforeEach(() => {
  window.localStorage.clear()
})

describe('Aplikasi Manajemen Buku Pribadi', () => {
  it('menampilkan empty state saat belum ada buku', () => {
    renderWithProviders()
    expect(
      screen.getByText(/Belum ada buku sesuai filter/i),
    ).toBeInTheDocument()
  })

  it('dapat menambah buku baru', async () => {
    const user = userEvent.setup()
    renderWithProviders()

    const formPanel = screen
      .getByRole('heading', { name: /Tambah Buku Baru/i })
      .closest('.panel')
    const form = within(formPanel)

    await user.type(form.getByLabelText(/Judul/i), 'Clean Architecture')
    await user.type(form.getByLabelText(/Penulis/i), 'Robert C. Martin')
    await user.selectOptions(form.getByLabelText(/Status/i), 'reading')
    await user.click(form.getByRole('button', { name: /Tambahkan Buku/i }))

    expect(screen.getByText(/Clean Architecture/i)).toBeInTheDocument()
    expect(screen.getByText(/oleh Robert C. Martin/i)).toBeInTheDocument()
  })

  it('memvalidasi form saat input kosong', async () => {
    const user = userEvent.setup()
    renderWithProviders()

    const formPanel = screen
      .getByRole('heading', { name: /Tambah Buku Baru/i })
      .closest('.panel')
    const form = within(formPanel)

    await user.click(form.getByRole('button', { name: /Tambahkan Buku/i }))

    expect(screen.getByText(/Judul wajib diisi/i)).toBeInTheDocument()
    expect(screen.getByText(/Nama penulis wajib diisi/i)).toBeInTheDocument()
  })

  it('menerapkan filter status buku', async () => {
    const user = userEvent.setup()
    renderWithProviders()

    const formPanel = screen
      .getByRole('heading', { name: /Tambah Buku Baru/i })
      .closest('.panel')
    const form = within(formPanel)
    const judul = form.getByLabelText(/Judul/i)
    const penulis = form.getByLabelText(/Penulis/i)
    const status = form.getByLabelText(/Status/i)
    const submit = form.getByRole('button', { name: /Tambahkan Buku/i })

    await user.type(judul, 'The Pragmatic Programmer')
    await user.type(penulis, 'Andrew Hunt')
    await user.selectOptions(status, 'owned')
    await user.click(submit)

    await user.type(judul, 'Refactoring UI')
    await user.type(penulis, 'Adam Wathan')
    await user.selectOptions(status, 'reading')
    await user.click(submit)

    const listPanel = screen
      .getByRole('heading', { name: /Daftar Buku/i })
      .closest('.panel')
    const filter = within(listPanel)
    await user.selectOptions(filter.getByLabelText(/Status/i), 'reading')

    const list = screen.getByTestId('book-list')
    expect(within(list).getByText(/Refactoring UI/i)).toBeInTheDocument()
    expect(within(list).queryByText(/The Pragmatic Programmer/i)).not.toBeInTheDocument()
  })

  it('menampilkan statistik koleksi buku', async () => {
    const user = userEvent.setup()
    renderWithProviders()

    const formPanel = screen
      .getByRole('heading', { name: /Tambah Buku Baru/i })
      .closest('.panel')
    const form = within(formPanel)

    await user.type(form.getByLabelText(/Judul/i), 'Domain-Driven Design')
    await user.type(form.getByLabelText(/Penulis/i), 'Eric Evans')
    await user.selectOptions(form.getByLabelText(/Status/i), 'owned')
    await user.click(form.getByRole('button', { name: /Tambahkan Buku/i }))

    await user.click(screen.getByRole('link', { name: /Statistik/i }))

    const statsPanel = screen
      .getByRole('heading', { name: /Ringkasan Koleksi Buku/i })
      .closest('.panel')
    const statsArea = within(statsPanel)

    const getValue = (label) => {
      const card = statsArea.getByText(label).closest('.stat-card')
      return within(card).getByText((content, node) =>
        node.classList?.contains('stat-card__value'),
      )
    }

    expect(getValue('Total Buku')).toHaveTextContent('1')
    expect(getValue('Dimiliki')).toHaveTextContent('1')
    expect(getValue('Sedang Dibaca')).toHaveTextContent('0')
    expect(getValue('Wishlist')).toHaveTextContent('0')
  })
})
