"use client";

import Image from "next/image";

import PageBanner from "@/shared/components/PageBanner";

const LineageDetailPage = () => {
  return (
    <div className="min-h-screen pb-20 relative font-sans">
      <div className="fixed inset-0 z-[-1] w-full h-full pointer-events-none">
        <Image
          src="/bg/ungho.png"
          alt=""
          fill
          className="object-cover opacity-10"
          priority
        />
      </div>
      {/* <PageBanner /> */}

      <div className="container mx-auto px-4 py-8 md:py-16 max-w-5xl">
        {/* Main Title */}
        <div className="text-center mb-16 select-none animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-[#8B0000] text-3xl sm:text-4xl lg:text-5xl font-bold uppercase leading-tight font-serif tracking-wide">
            Jamtul Rinpoche Jamyang Sherab Özer
          </h1>
          <div className="w-32 h-1 bg-[#C5A059] mx-auto mt-6 rounded-full"></div>
          <p className="mt-4 text-gray-600 text-base md:text-lg italic">
            Biography
          </p>
        </div>

        {/* Section 1: Intro */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 mb-12 md:mb-20 items-center">
          <div className="md:col-span-9 space-y-4 md:space-y-6 text-justify text-gray-800 text-base md:text-lg leading-relaxed">
            <p className="drop-cap">
              In short, Jamtul Rinpoche Jamyang Sherab Özer devoted his life to
              studying and reflecting on both Sūtra and Tantra, along with other
              sciences. He often stayed in mountain retreats, where he found
              great success in his practice.
            </p>
            <p>
              To benefit others, he supported the Dharma through teaching,
              study, and writing. Living as a hidden yogi, he dedicated his life
              to practicing Dzogchen.
            </p>
          </div>
          <div className="md:col-span-3 flex justify-center">
            <div className="relative p-2 bg-white shadow-xl border border-gray-100 rounded-sm max-w-[220px]">
              <Image
                src="/img/z7499108390156_59f57b101d012082d85a9c6e031cd76d.jpg"
                alt="Jamtul Rinpoche Portrait"
                width={220}
                height={300}
                priority
                sizes="220px"
                className="w-full h-auto object-cover rounded-sm"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Early Life & Recognition */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 mb-12 md:mb-20">
          <div className="md:col-span-3 flex justify-center order-2 md:order-1 items-start pt-4 md:pt-8">
            <div className="relative p-2 bg-white shadow-xl border border-gray-100 rounded-sm max-w-[200px] md:max-w-[300px]">
              <Image
                src="/img/z7499108390155_e4fdb04b813ceca0bd2f2f247806283c.jpg"
                alt="Young Jamtul Rinpoche"
                width={300}
                height={400}
                sizes="(max-width: 768px) 200px, 300px"
                className="w-full h-auto object-cover rounded-sm"
              />
            </div>
          </div>
          <div className="md:col-span-9 space-y-4 md:space-y-6 text-justify text-gray-800 text-base md:text-lg leading-relaxed order-1 md:order-2">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#8B0000] mb-2 border-b-2 border-gray-200 inline-block pb-1">
              Early Life & Recognition
            </h2>
            <p>
              Jamyang Sherab Özer Rinpoche was born in 1910 in eastern Tibet,
              into the Nangchen Tagtsar family, which is part of the Mugpo Ling
              lineage from the Tamshung Boldé region. His parents were Tagtsar
              Könchok Tendhar and Pönza Karzes Lhamo. He was born in the Iron
              Male Dog year of the fifteenth Tibetan Rabjung cycle, and many
              auspicious signs appeared during his birth.
            </p>
            <p>
              The great master Druang Trashichöpel Rinpoche recognized him as
              the third incarnation of the Jamtul Rinpoche of Tagtsar Zanyin
              Monastery, Thupten Chökhor, in Nangchen (the first Jamtul Rinpoche
              incarnation was Jamyang Tendzin Namgyal; the second Jampel
              incarnation was Jamyang Norbu Gyaltsen), and Druang Trashichöpel
              Rinpoche gave him the name Jamyang Sherab Özer. Yongdzin Lodrö
              Tendzin became his tutor, and from a young age, he learned
              reading, writing, and other subjects with great skill.
            </p>
          </div>
        </div>

        {/* Section 3: Education & Practice */}
        <div className="space-y-4 md:space-y-6 text-justify text-gray-800 text-base md:text-lg leading-relaxed mb-12">
          <h2 className="text-xl md:text-2xl font-serif font-bold text-[#8B0000] mb-2 border-b-2 border-gray-200 inline-block pb-1">
            Education & Practice
          </h2>
          <div className="float-none md:float-right mx-auto md:ml-8 mb-6 w-full md:w-1/4 max-w-[180px]">
            <div className="relative p-2 bg-white shadow-xl border border-gray-100 rounded-sm">
              <Image
                src="/img/z7499108390158_68dcdcd82f75b2edc9b8c592b723661b.jpg"
                alt="Jamtul Rinpoche Teaching"
                width={400}
                height={500}
                sizes="180px"
                className="w-full h-auto object-cover rounded-sm"
              />
              {/* <p className="text-center text-xs text-gray-500 mt-2 italic">
                Jamtul Rinpoche
              </p> */}
            </div>
          </div>
          <p>
            In 1923, at the age of thirteen, he went to the Zurmang Namgyal
            Lhatse monastic college in Nangchen. There, he became a direct
            disciple of the Khenchen Padma Namgyal Rinpoche, a close student of
            the great master Dzogchen Khenpo Zhenga, who was clearly praised by
            the vajra prophecies of both the oral transmission (bka’) and
            treasure (gter).
          </p>
          <p>
            Under Khenchen Padma Namgyal’s guidance, Jamtul Rinpoche mastered
            Sūtra, Tantra, language studies, Tibetan medicine, and other
            subjects. After completing his studies and deep reflection, he
            became a respected scholar. He then focused on practice, spending
            time in mountain retreats and applying the teachings he had learned.
          </p>
          <p>
            At times, he also taught Sūtra and Tantra to devoted students. After
            Zurmang Khenchen Pema Namgyal passed away, he settled in the central
            Tibetan region of Nangchen, living as a free and unattached Yogi,
            having visited holy places for pilgrimage and practicing meditation.
          </p>
        </div>

        {/* Section 4: Empowerments & Treasures */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 mb-12 md:mb-20 bg-[#fffcf5] p-5 md:p-8 rounded-lg shadow-inner border border-[#e5d5b5]">
          <div className="md:col-span-12 space-y-4 md:space-y-6 text-justify text-gray-800 text-base md:text-lg leading-relaxed">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#8B0000] mb-2 md:mb-4 text-center">
              Empowerments & Treasures
            </h2>
            <p>
              When His Holiness Dudjom Jikdrel Yeshe Dorje gave the empowerments
              of the Rinchen Terdzö (Treasury of Precious Termas) for the first
              time, Jampal Rinpoche received them and became a student. It was
              said that at that time, because some of the empowerment tskali
              (icons) were incomplete, Jampal Rinpoche hand-drew the missing
              parts of the takli.
            </p>
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center py-4 md:py-6">
              <div className="flex-1 space-y-4">
                <p className="mb-4">
                  During that time, he first met Kyabjé Chatral Sangye Dorje.
                  Later, when Chatral Rinpoche became the head lama of the fifth
                  Reting Rinpoche, Thubten Jampal Yeshe Gyaltsen, Kyabjé Chatral
                  Rinpoche, and Jamtul Rinpoche developed a very close
                  relationship.
                </p>
                <p>
                  Jamtul Rinpoche met treasure revealer Ratreng Terchen Sangye
                  Wangdü, an emanation of great treasure revealer Nubchen Sangyé
                  Yeshé. Due to their past karma and prayers, and a perfect
                  auspicious connection, Jamtul Rinpoche became the chos bdag
                  (dharma-lord) of the circle of treasure teaching of the Padmé
                  Sangtik, according to the prophecies of Ratreng Terchen Sangye
                  Wangdü.
                </p>
              </div>
              <div className="w-full md:w-1/4 shrink-0 max-w-[200px]">
                <div className="relative p-2 bg-white shadow-xl border border-gray-100 rounded-sm">
                  <Image
                    src="/img/jamtul_4.jpg"
                    alt="Jamtul Rinpoche Ceremony"
                    width={400}
                    height={500}
                    sizes="200px"
                    className="w-full h-auto object-cover rounded-sm"
                  />
                </div>
              </div>
            </div>
            <p>
              Jamtul wrote supplements and notes for these treasure teachings
              and played the key role in preserving and passing them down to
              future generations.
            </p>
          </div>
        </div>

        {/* Section 5: Founding Monasteries & Exile */}
        <div className="space-y-4 md:space-y-6 text-justify text-gray-800 text-base md:text-lg leading-relaxed mb-12 md:mb-16">
          <h2 className="text-xl md:text-2xl font-serif font-bold text-[#8B0000] mb-2 border-b-2 border-gray-200 inline-block pb-1">
            Founding Monasteries & Life in Exile
          </h2>
          <p>
            In 1943, in a remote and secluded area of Damrag Chen in northern
            Ü-Tsang, Jamtul Rinpoche, along with his brother, Kyabjé Shingdrup
            Rinpoche Ngawang Gyurme Tenzin, founded Kunsang Do-ngak Ling
            monastery to study and practice the teaching of Buddha dharma.
            Because of his close relationship with the fifth Reting Rinpoche
            Thubten Jampel Yeshe Gyaltsen, who served as the regent after the
            passing of the Thirteenth Dalai Lama. At the request of Rating
            Rinpoché, Jamtul established a new retreat center called Ngar
            Gomchen Orgyen Ling in the Reting region, where he actively promoted
            its teachings and practices. Also, because Jamtul Rinpoche spent a
            long time in retreat in the Crystal Cave of Nyenchen Tanglha, in
            Damrak Chen Drilhai’s hermitage, he became widely known as Sheldkar
            Rinpoche (white crystal Rinpoche).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
            <div className="md:col-span-8">
              <p className="mb-4">
                In 1958, Jamtul Rinpoche went on a pilgrimage to India with a
                few attendants, visiting major sacred sites, including Bodh
                Gaya. He then traveled to Sikkim, where he spent a long time
                receiving empowerments and teachings from Dzongsar Jamyang
                Khyentse Chökyi Lodrö before returning to Tibet.
              </p>
              <p>
                In 1959, after the Chinese invasion of Tibet, Jamtul Rinpoche
                went into exile in India. He settled in the Settlement camp in
                Orissa, where he served as one of the prominent lamas of Dudul
                Rabtenling Monastery. He also offered spiritual guidance to the
                people of the settlement’s third camp.
              </p>
            </div>
            <div className="md:col-span-3">
              <div className="relative p-2 bg-white shadow-xl border border-gray-100 rounded-sm max-w-[180px] mx-auto">
                <Image
                  src="/img/jamtul_5.jpg"
                  alt="Jamtul Rinpoche Later Years"
                  width={400}
                  height={500}
                  sizes="180px"
                  className="w-full h-auto object-cover rounded-sm"
                />
              </div>
            </div>
          </div>

          <p>
            Likewise, he also gave instruction in the arts and sciences to some
            earnest young people from that area.As per the instructions of His
            Holiness the Dalai Lama, and at the invitation of the Tibetan
            Government Performing Arts Troupe in Dharamsala, he improved
            existing material and innovated new compositions of songs, melodies,
            etc., for the opera Chögyal Ngadak Lhatsenpo Tri Rel, thus
            benefitting the teachings and all beings.
          </p>
          <p>
            He also taught literacy and philosophical texts to eager young
            people in the area. Following the instructions of His Holiness the
            Dalai Lama and an invitation from the Arts Troupe in Dharamsala, he
            improved existing works, wrote lyrics, and created new melodies for
            the opera Chögyal Ngadak Lhatsenpo Tri Rel. He mastered all major
            subjects.
          </p>
        </div>

        {/* Writings & Parinirvana */}
        <div className="bg-[#f9f9f9] border-l-4 border-[#8B0000] p-4 md:p-6 rounded-r-lg shadow-sm">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 uppercase tracking-wide">
            Legacy
          </h3>
          <p className="text-gray-700 italic text-base md:text-lg leading-relaxed">
            Jamtul Rinpoche’s writings include “The Epic of Ling Gesar: The
            Deathless Drum of the Gods,” works on the White Ling Horse Race, and
            notes on the Ling Dance of Great Blissful Play. He also compiled
            rituals for the Padma Sangtik Gongdü circle, along with many prayers
            and aspirations. In short, through giving empowerments,
            transmissions, and pith instructions, he guided many fortunate
            beings on the path to awakening. In 1987, amid wondrous and
            auspicious signs, he passed into nirvāṇa.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LineageDetailPage;
