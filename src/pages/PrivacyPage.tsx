
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Πολιτική Απορρήτου</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg">
              Η ΕκπαιδευτικήΓωνιά δεσμεύεται για την προστασία της ιδιωτικότητάς σας. 
              Αυτή η Πολιτική Απορρήτου εξηγεί πώς συλλέγουμε, χρησιμοποιούμε και προστατεύουμε 
              τις πληροφορίες σας.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Συλλογή Πληροφοριών</h2>
            <p>
              Συλλέγουμε πληροφορίες που παρέχετε απευθείας σε εμάς όταν εγγράφεστε, 
              δημιουργείτε λογαριασμό ή επικοινωνείτε μαζί μας. Αυτές μπορεί να περιλαμβάνουν 
              όνομα, email, σχολείο και άλλα στοιχεία επικοινωνίας.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Χρήση Πληροφοριών</h2>
            <p>
              Χρησιμοποιούμε τις πληροφορίες που συλλέγουμε για:
            </p>
            <ul className="mt-2 space-y-2">
              <li>Παροχή, συντήρηση και βελτίωση της πλατφόρμας μας</li>
              <li>Επικοινωνία μαζί σας σχετικά με την πλατφόρμα</li>
              <li>Ανταπόκριση στα αιτήματά σας</li>
              <li>Παρακολούθηση και ανάλυση των τάσεων χρήσης</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">3. Κοινοποίηση Πληροφοριών</h2>
            <p>
              Δεν πωλούμε, εμπορευόμαστε ή μεταφέρουμε με άλλο τρόπο τις προσωπικές σας 
              πληροφορίες σε τρίτους χωρίς τη ρητή συγκατάθεσή σας, εκτός εάν απαιτείται 
              από το νόμο.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Ασφάλεια</h2>
            <p>
              Λαμβάνουμε εύλογα μέτρα για να προστατεύσουμε τις προσωπικές σας πληροφορίες. 
              Ωστόσο, καμία μέθοδος μετάδοσης μέσω διαδικτύου ή ηλεκτρονικής αποθήκευσης 
              δεν είναι 100% ασφαλής.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Αλλαγές σε Αυτήν την Πολιτική</h2>
            <p>
              Ενδέχεται να ενημερώσουμε αυτήν την πολιτική απορρήτου από καιρό σε καιρό. 
              Θα σας ειδοποιήσουμε για τυχόν αλλαγές δημοσιεύοντας τη νέα πολιτική 
              απορρήτου σε αυτήν τη σελίδα.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">6. Επικοινωνία</h2>
            <p>
              Εάν έχετε οποιεσδήποτε ερωτήσεις σχετικά με αυτήν την Πολιτική Απορρήτου, 
              επικοινωνήστε μαζί μας στο: 
              <a href="mailto:dimitris.liofis@atsoglou.gr" className="text-primary hover:underline ml-1">
                dimitris.liofis@atsoglou.gr
              </a>
            </p>
          </div>
          
          <div className="mt-12 flex justify-center">
            <Link to="/">
              <Button>Επιστροφή στην αρχική</Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPage;
