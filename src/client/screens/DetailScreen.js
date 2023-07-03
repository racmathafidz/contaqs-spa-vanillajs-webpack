import { state } from '../state.js';
import Link from '../components/Link.js';
import Space from '../components/Space.js';
import ContactDetail from '../components/ContactDetail.js';

export default function DetailScreen() {
    const linkHome = Link({
        href: '/home',
        label: 'Kembali ke Home',
    });

    const div = document.createElement('div');
    div.append(linkHome);
    div.append(Space());
    div.append(ContactDetail(state.detailContact));

    return div;
}